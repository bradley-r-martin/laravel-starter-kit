import { useEffect, useState } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

const SCRIPT_ID = 'google-places-script';
const CALLBACK_NAME = '__googlePlacesScriptOnLoad__';

declare global {
    interface Window {
        __googlePlacesScriptPromise__?: Promise<void>;
        __googlePlacesScriptResolver__?: () => void;
        __googlePlacesScriptRejecter__?: (error: ErrorEvent) => void;
        __googlePlacesScriptOnLoad__?: () => void;
    }
}

const isPlacesAvailable = () =>
    typeof window !== 'undefined' && (window as any).google?.maps?.places;

export const useGooglePlacesScript = () => {
    const [status, setStatus] = useState<ScriptStatus>(() =>
        isPlacesAvailable() ? 'ready' : 'idle'
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'ready' || status === 'loading') {
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        if (isPlacesAvailable()) {
            setStatus('ready');
            return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            setStatus('error');
            setError('Google Maps API key is not configured.');
            return;
        }

        setStatus('loading');

        if (window.__googlePlacesScriptPromise__) {
            window.__googlePlacesScriptPromise__
                ?.then(() => setStatus('ready'))
                .catch((event) => {
                    setStatus('error');
                    setError(event?.message ?? 'Failed to load Google Maps script.');
                });
            return;
        }

        window.__googlePlacesScriptPromise__ = new Promise<void>((resolve, reject) => {
            window.__googlePlacesScriptResolver__ = resolve;
            window.__googlePlacesScriptRejecter__ = reject;
        });

        const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

        if (existingScript) {
            const handleLoad = () => {
                setStatus('ready');
                window.__googlePlacesScriptResolver__?.();
            };

            const handleError = (event: Event) => {
                setStatus('error');
                const errorMessage = event instanceof ErrorEvent ? event.message : undefined;
                setError(errorMessage ?? 'Failed to load Google Maps script.');
                window.__googlePlacesScriptRejecter__?.(
                    event instanceof ErrorEvent
                        ? event
                        : new ErrorEvent('error', { message: errorMessage })
                );
            };

            existingScript.addEventListener('load', handleLoad);
            existingScript.addEventListener('error', handleError);

            return () => {
                existingScript.removeEventListener('load', handleLoad);
                existingScript.removeEventListener('error', handleError);
            };
        }

        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${CALLBACK_NAME}`;
        script.dataset.googlePlaces = 'true';

        const handleScriptError = (event: Event) => {
            setStatus('error');
            const errorMessage = event instanceof ErrorEvent ? event.message : undefined;
            setError(errorMessage ?? 'Failed to load Google Maps script.');
            window.__googlePlacesScriptRejecter__?.(
                event instanceof ErrorEvent
                    ? event
                    : new ErrorEvent('error', { message: errorMessage })
            );
            delete window.__googlePlacesScriptOnLoad__;
        };

        const handleScriptLoad = () => {
            setStatus('ready');
            window.__googlePlacesScriptResolver__?.();
            delete window.__googlePlacesScriptOnLoad__;
            delete (window as unknown as Record<string, unknown>)[CALLBACK_NAME];
        };

        window.__googlePlacesScriptOnLoad__ = handleScriptLoad;
        (window as unknown as Record<string, unknown>)[CALLBACK_NAME] = handleScriptLoad;

        script.addEventListener('error', handleScriptError);

        document.head.appendChild(script);

        window.__googlePlacesScriptPromise__
            ?.then(() => setStatus('ready'))
            .catch((event) => {
                setStatus('error');
                const errorMessage = event instanceof ErrorEvent ? event.message : undefined;
                setError(errorMessage ?? 'Failed to load Google Maps script.');
            });

        return () => {
            script.removeEventListener('error', handleScriptError);
        };
    }, [status]);

    return {
        ready: status === 'ready',
        status,
        error,
    };
};
