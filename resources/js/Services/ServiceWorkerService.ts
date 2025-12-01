/**
 * Service for managing service worker registration and updates
 */
class ServiceWorkerService {
    private registration: ServiceWorkerRegistration | null = null;
    private updateCheckInterval: number | null = null;

    /**
     * Check if service workers are supported
     */
    public isSupported(): boolean {
        return 'serviceWorker' in navigator;
    }

    /**
     * Register the service worker
     */
    public async register(): Promise<ServiceWorkerRegistration | null> {
        if (!this.isSupported()) {
            console.log('[Service Worker] Not supported in this browser');
            return null;
        }

        // Check if we already have a registration
        if (this.registration) {
            return this.registration;
        }

        // Check if there's already an active service worker controlling the page
        if (navigator.serviceWorker.controller) {
            // Get existing registration
            const existingRegistration = await navigator.serviceWorker.getRegistration();
            if (existingRegistration) {
                this.registration = existingRegistration;
                this.setupUpdateHandling();
                // Don't set up interval again if already set up
                if (!this.updateCheckInterval) {
                    this.updateCheckInterval = window.setInterval(
                        () => {
                            this.checkForUpdates();
                        },
                        60 * 60 * 1000
                    );
                }
                return this.registration;
            }
        }

        // Check for any existing registration (even if not controlling)
        const existingRegistration = await navigator.serviceWorker.getRegistration();
        if (existingRegistration) {
            this.registration = existingRegistration;
            this.setupUpdateHandling();
            if (!this.updateCheckInterval) {
                this.updateCheckInterval = window.setInterval(
                    () => {
                        this.checkForUpdates();
                    },
                    60 * 60 * 1000
                );
            }
            return this.registration;
        }

        try {
            // Register service worker (version is baked into the file, no need for query string)
            this.registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/',
            });

            console.log('[Service Worker] Registered:', this.registration.scope);

            // Handle updates
            this.setupUpdateHandling();

            // Check for updates periodically (every hour)
            if (!this.updateCheckInterval) {
                this.updateCheckInterval = window.setInterval(
                    () => {
                        this.checkForUpdates();
                    },
                    60 * 60 * 1000
                );
            }

            return this.registration;
        } catch (error) {
            console.error('[Service Worker] Registration failed:', error);
            return null;
        }
    }

    /**
     * Setup handling for service worker updates
     */
    private setupUpdateHandling(): void {
        if (!this.registration) return;

        // Listen for service worker updates
        this.registration.addEventListener('updatefound', () => {
            const newWorker = this.registration?.installing;
            if (!newWorker) return;

            console.log('[Service Worker] New service worker found, installing...');

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // New service worker is waiting
                        console.log(
                            '[Service Worker] New service worker installed, waiting to activate'
                        );
                        this.handleUpdateAvailable();
                    } else {
                        // First time installation
                        console.log('[Service Worker] Service worker installed for the first time');
                    }
                }

                if (newWorker.state === 'activated') {
                    console.log('[Service Worker] New service worker activated');
                    this.handleUpdateActivated();
                }
            });
        });

        // Listen for controller change (service worker takeover)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[Service Worker] Controller changed, reloading page...');
            window.location.reload();
        });
    }

    /**
     * Handle when a new service worker update is available
     */
    private handleUpdateAvailable(): void {
        // Optionally show a notification to the user
        // For now, we'll automatically activate on next page load
        // You can add a UI notification here if desired
    }

    /**
     * Handle when the new service worker has been activated
     */
    private handleUpdateActivated(): void {
        // Reload the page to use the new service worker
        // This ensures all cached assets are updated
        if (navigator.serviceWorker.controller) {
            window.location.reload();
        }
    }

    /**
     * Manually check for service worker updates
     */
    public async checkForUpdates(): Promise<void> {
        if (!this.registration) {
            await this.register();
            return;
        }

        try {
            await this.registration.update();
            console.log('[Service Worker] Update check completed');
        } catch (error) {
            console.error('[Service Worker] Update check failed:', error);
        }
    }

    /**
     * Unregister the service worker (useful for debugging)
     */
    public async unregister(): Promise<boolean> {
        if (this.updateCheckInterval) {
            clearInterval(this.updateCheckInterval);
            this.updateCheckInterval = null;
        }

        if (!this.registration) {
            return false;
        }

        try {
            const result = await this.registration.unregister();
            console.log('[Service Worker] Unregistered:', result);
            this.registration = null;
            return result;
        } catch (error) {
            console.error('[Service Worker] Unregister failed:', error);
            return false;
        }
    }

    /**
     * Get the current service worker registration
     */
    public getRegistration(): ServiceWorkerRegistration | null {
        return this.registration;
    }
}

const serviceWorkerService = new ServiceWorkerService();
export default serviceWorkerService;
