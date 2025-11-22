import InvoiceAnalysisService, { InvoiceImage } from '@/Services/InvoiceAnalysisService';
import { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';

type AnalysisStatus =
    | 'loading-error'
    | 'loading'
    | 'analysing'
    | 'analysing-error'
    | 'ready'
    | 'complete';

export const useInvoiceAnalysis = <Response = unknown>() => {
    const [data, setData] = useState<InvoiceImage[] | undefined>(undefined);
    const [error, setError] = useState<string | undefined>();
    const [status, setStatus] = useState<AnalysisStatus>('ready');

    const upload = useCallback(
        async (file: File | null): Promise<AxiosResponse<Response> | undefined> => {
            if (!file) {
                return;
            }

            setError(undefined);
            setStatus('analysing');

            try {
                const { images, response } = await InvoiceAnalysisService.analyze<Response>(file);
                setData(images);
                setStatus('complete');
                return response;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                setError(errorMessage);
                setStatus('analysing-error');
                throw error;
            }
        },
        []
    );

    return {
        error,
        data,
        status,
        upload,
    };
};

export default useInvoiceAnalysis;
