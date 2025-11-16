import { geocoderToAddress } from '@/Utilities/Transformers';
import { useCallback, useEffect, useRef, useState } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

const SCRIPT_ID = 'google-places-script';

declare global {
    interface Window {
        __googlePlacesScriptPromise__?: Promise<void>;
    }
}

const isPlacesAvailable = () =>
    typeof window !== 'undefined' && (window as any).google?.maps?.places;

const messageFromEvent = (event: unknown): string =>
    event instanceof Error
        ? event.message
        : event instanceof ErrorEvent
          ? event.message
          : 'Failed to load Google Maps script.';

const initializeService = (
    setStatus: (s: ScriptStatus) => void,
    autocompleteServiceRef: React.MutableRefObject<google.maps.places.AutocompleteService | null>,
    placesServiceRef: React.MutableRefObject<google.maps.places.PlacesService | null>
) => {
    if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
    if (!placesServiceRef.current) {
        placesServiceRef.current = new window.google.maps.places.PlacesService(
            document.createElement('div') // required but unused
        );
    }
    setStatus('ready');
};

const ensurePlacesScript = (apiKey: string): Promise<void> => {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Window is not available.'));
    }

    if (isPlacesAvailable()) {
        return Promise.resolve();
    }

    if (!window.__googlePlacesScriptPromise__) {
        const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

        if (existingScript) {
            window.__googlePlacesScriptPromise__ = new Promise<void>((resolve, reject) => {
                const onLoad = () => resolve();
                const onError = (event: Event) =>
                    reject(event instanceof ErrorEvent ? event : new ErrorEvent('error'));
                existingScript.addEventListener('load', onLoad, { once: true });
                existingScript.addEventListener('error', onError, { once: true });
            });
        } else {
            window.__googlePlacesScriptPromise__ = new Promise<void>((resolve, reject) => {
                const script = document.createElement('script');
                script.id = SCRIPT_ID;
                script.async = true;
                script.defer = true;
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.dataset.googlePlaces = 'true';

                const onLoad = () => resolve();
                const onError = (event: Event) =>
                    reject(event instanceof ErrorEvent ? event : new ErrorEvent('error'));

                script.addEventListener('load', onLoad, { once: true });
                script.addEventListener('error', onError, { once: true });

                document.head.appendChild(script);
            });
        }
    }

    return window.__googlePlacesScriptPromise__!;
};

export const useGooglePlacesScript = () => {
    const [status, setStatus] = useState<ScriptStatus>(() =>
        isPlacesAvailable() ? 'ready' : 'idle'
    );
    const [error, setError] = useState<string | null>(null);

    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            setStatus('error');
            setError('Google Maps API key is not configured.');
            return;
        }

        setStatus('loading');

        let cancelled = false;
        ensurePlacesScript(apiKey)
            .then(() => {
                if (cancelled) return;
                if (!isPlacesAvailable()) {
                    throw new Error('Google Maps Places library not available after load.');
                }
                initializeService(setStatus, autocompleteServiceRef, placesServiceRef);
            })
            .catch((event: unknown) => {
                if (cancelled) return;
                setStatus('error');
                setError(messageFromEvent(event));
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);

    const predict = useCallback(
        async (address: string) => {
            if (status !== 'ready' || !autocompleteServiceRef.current) {
                setPredictions([]);
                return;
            }
            const trimmed = address.trim();
            if (trimmed.length === 0) {
                setPredictions([]);
                return;
            }

            autocompleteServiceRef.current.getPlacePredictions(
                {
                    input: trimmed,
                    location: new google.maps.LatLng(-35.2802, 149.131),
                    radius: 2000,
                    types: ['address'],
                    locationBias: new google.maps.LatLng(-35.2802, 149.131),
                },
                (p, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setPredictions(p ?? []);
                    } else {
                        setPredictions([]);
                    }
                }
            );
        },
        [status]
    );

    const select = useCallback(
        async (prediction: google.maps.places.AutocompletePrediction) => {
            return new Promise<Domain.Address | null>((resolve, reject) => {
                if (status !== 'ready' || !placesServiceRef.current) {
                    reject(new Error('Places service not ready'));
                    return;
                }
                placesServiceRef.current.getDetails(
                    {
                        placeId: prediction.place_id,
                    },
                    (result, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
                            resolve(geocoderToAddress(prediction.description, result));
                        } else {
                            reject(new Error('Error getting details'));
                        }
                    }
                );
            });
        },
        [status]
    );

    return {
        ready: status === 'ready',
        status,
        error,
        predictions,
        predict,
        select,
    };
};
