/**
 * Service for managing iOS PWA navigation locking to prevent navigation
 * and URL changes in iOS PWA standalone mode
 */
class IosPwaNavigationLockService {
    private isActive = false;
    private originalPushState: typeof history.pushState | null = null;
    private originalReplaceState: typeof history.replaceState | null = null;
    private popstateHandler: ((e: PopStateEvent) => void) | null = null;
    private hashchangeHandler: ((e: HashChangeEvent) => void) | null = null;

    /**
     * No-op function that logs blocked navigation attempts
     */
    private noop = (...args: any[]): null => {
        console.warn('[PWA] Navigation blocked to preserve standalone mode.', args);
        return null;
    };

    /**
     * Check if the navigation lock is currently active
     */
    public isLockActive(): boolean {
        return this.isActive;
    }

    /**
     * Activate navigation locking to prevent navigation in iOS PWA standalone mode
     */
    public activate(): void {
        if (this.isActive) {
            console.warn('[PWA] Navigation lock is already active.');
            return;
        }

        // Store original methods for potential restoration
        this.originalPushState = history.pushState;
        this.originalReplaceState = history.replaceState;

        // --- 1. Patch history methods safely ---
        try {
            history.pushState = this.noop as any;
            history.replaceState = this.noop as any;
        } catch (err) {
            console.warn('[PWA] Could not override history methods:', err);
        }

        // --- 2. Patch window.location changes (assignment) ---
        const originalLocation = window.location;
        try {
            // Intercept `window.location = "something"`
            Object.defineProperty(window, 'location', {
                configurable: false,
                enumerable: true,
                get: () => originalLocation,
                set: (val) => {
                    console.warn('[PWA] Direct location assignment blocked:', val);
                },
            });
        } catch (err) {
            console.warn('[PWA] Could not redefine window.location:', err);
        }

        // --- 3. Prevent popstate & hash navigation ---
        this.popstateHandler = (e: PopStateEvent) => {
            console.warn('[PWA] popstate navigation blocked:', e);
            e.preventDefault();
            if (this.originalPushState) {
                this.originalPushState.call(history, null, '', window.location.href);
            }
        };

        this.hashchangeHandler = (e: HashChangeEvent) => {
            console.warn('[PWA] hashchange blocked:', e);
            e.preventDefault();
            if (this.originalPushState) {
                this.originalPushState.call(history, null, '', window.location.href.split('#')[0]);
            }
        };

        window.addEventListener('popstate', this.popstateHandler);
        window.addEventListener('hashchange', this.hashchangeHandler);

        // --- 4. Defensive overrides for assign/replace/reload if possible ---
        try {
            window.location.assign = this.noop as any;
            window.location.replace = this.noop as any;
            window.location.reload = this.noop as any;
        } catch {
            // On Safari, these are non-writable — just ignore
        }

        this.isActive = true;
        console.log('[PWA] Navigation locking active.');
    }

    /**
     * Deactivate navigation locking and restore original methods
     */
    public deactivate(): void {
        if (!this.isActive) {
            console.warn('[PWA] Navigation lock is not active.');
            return;
        }

        // Restore original history methods
        if (this.originalPushState) {
            try {
                history.pushState = this.originalPushState;
            } catch (err) {
                console.warn('[PWA] Could not restore history.pushState:', err);
            }
        }

        if (this.originalReplaceState) {
            try {
                history.replaceState = this.originalReplaceState;
            } catch (err) {
                console.warn('[PWA] Could not restore history.replaceState:', err);
            }
        }

        // Remove event listeners
        if (this.popstateHandler) {
            window.removeEventListener('popstate', this.popstateHandler);
            this.popstateHandler = null;
        }

        if (this.hashchangeHandler) {
            window.removeEventListener('hashchange', this.hashchangeHandler);
            this.hashchangeHandler = null;
        }

        this.isActive = false;
        console.log('[PWA] Navigation locking deactivated.');
    }
}

// Export singleton instance as default
const iosPwaNavigationLockService = new IosPwaNavigationLockService();

export default iosPwaNavigationLockService;
