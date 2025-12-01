import { useCallback, useEffect, useRef, useState } from 'react';

type LocationStatus = 'idle' | 'requesting' | 'unauthorised' | 'watching' | 'error' | 'unsupported';

interface UseLocationReturn {
    latitude: number | null;
    longitude: number | null;
    status: LocationStatus;
    error: Error | string | null;
    requestPermission: () => Promise<void>;
    stopWatching: () => void;
}

interface PositionError {
    code: number;
    message: string;
}

interface LastPosition {
    latitude: number;
    longitude: number;
}

/**
 * Calculate the distance between two coordinates in meters using the Haversine formula
 */
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Hook for accessing and watching user's geolocation
 * Manages permission requests, location watching, and state
 */
export default function useLocation(): UseLocationReturn {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [status, setStatus] = useState<LocationStatus>('idle');
    const [error, setError] = useState<Error | string | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const lastPositionRef = useRef<LastPosition | null>(null);
    const MOVEMENT_THRESHOLD_METERS = 100;

    const stopWatching = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
            lastPositionRef.current = null;
            setStatus('idle');
        }
    }, []);

    const requestPermission = useCallback(async (): Promise<void> => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setStatus('unsupported');
            setError('Geolocation is not supported by this browser');
            return;
        }

        setStatus('requesting');
        setError(null);

        // Request permission by attempting to get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Permission granted - always update on first position
                const initialLat = position.coords.latitude;
                const initialLon = position.coords.longitude;
                setLatitude(initialLat);
                setLongitude(initialLon);
                lastPositionRef.current = { latitude: initialLat, longitude: initialLon };
                setStatus('watching');

                // Start watching position
                if (watchIdRef.current === null) {
                    watchIdRef.current = navigator.geolocation.watchPosition(
                        (position) => {
                            const newLat = position.coords.latitude;
                            const newLon = position.coords.longitude;

                            // Check if we should update based on movement threshold
                            const shouldUpdate =
                                lastPositionRef.current === null ||
                                calculateDistance(
                                    lastPositionRef.current.latitude,
                                    lastPositionRef.current.longitude,
                                    newLat,
                                    newLon
                                ) >= MOVEMENT_THRESHOLD_METERS;

                            if (shouldUpdate) {
                                setLatitude(newLat);
                                setLongitude(newLon);
                                lastPositionRef.current = { latitude: newLat, longitude: newLon };
                                setStatus('watching');
                                setError(null);
                            }
                        },
                        (error: PositionError) => {
                            if (error.code === 1) {
                                // PERMISSION_DENIED
                                setStatus('unauthorised');
                                setError('Location permission denied');
                            } else {
                                setStatus('error');
                                setError(error.message);
                            }
                            stopWatching();
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0,
                        }
                    );
                }
            },
            (error: PositionError) => {
                if (error.code === 1) {
                    // PERMISSION_DENIED
                    setStatus('unauthorised');
                    setError('Location permission denied');
                } else if (error.code === 2) {
                    // POSITION_UNAVAILABLE
                    setStatus('error');
                    setError('Location information unavailable');
                } else if (error.code === 3) {
                    // TIMEOUT
                    setStatus('error');
                    setError('Location request timed out');
                } else {
                    setStatus('error');
                    setError(error.message);
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [stopWatching]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopWatching();
        };
    }, [stopWatching]);

    return {
        latitude,
        longitude,
        status,
        error,
        requestPermission,
        stopWatching,
    };
}

