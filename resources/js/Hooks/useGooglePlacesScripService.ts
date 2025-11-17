import GoogleAddressLookupService from '@/Services/GoogleAddressLookupService';
import { geocoderToAddress } from '@/Utilities/Transformers';
import { useCallback, useState } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

export const useGooglePlacesScriptService = () => {
    const [status, setStatus] = useState<ScriptStatus>('ready');
    const [error, setError] = useState<string | null>(null);

    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);

    const predict = useCallback(
        async (address: string) => {
            setError(null);
            setStatus('loading');
            return GoogleAddressLookupService.search(address)
                .then((predictions) => {
                    setPredictions(predictions);
                    return predictions;
                })
                .catch((error) => {
                    setError(error);
                    return error;
                })
                .finally(() => {
                    setStatus('ready');
                });
        },
        [status]
    );

    const select = useCallback(
        async (prediction: google.maps.places.AutocompletePrediction) => {
            setError(null);
            setStatus('loading');
            return new Promise<Domain.Address | null>((resolve, reject) => {
                return GoogleAddressLookupService.select(prediction)
                    .then((result) => {
                        resolve(geocoderToAddress(prediction.description, result));
                    })
                    .catch((error) => {
                        reject(error);
                        setError(error);
                    })
                    .finally(() => {
                        setStatus('ready');
                    });
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
