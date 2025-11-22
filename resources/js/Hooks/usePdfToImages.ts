import PdfToImagesService, { PDFToImages } from '@/Services/PdfToImagesService';
import { useCallback, useState } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

export type { PDFToImages };

export const usePdfToImages = () => {
    const [status, setStatus] = useState<ScriptStatus>('ready');
    const [error, setError] = useState<string | null>(null);

    const convert = useCallback(async (file: File) => {
        setError(null);
        setStatus('loading');
        return PdfToImagesService.convert(file)
            .then((result) => {
                setStatus('ready');
                return result;
            })
            .catch((error) => {
                setError(error instanceof Error ? error.message : String(error));
                setStatus('error');
                throw error;
            });
    }, []);

    return {
        ready: status === 'ready',
        status,
        error,
        convert,
    };
};

export default usePdfToImages;
