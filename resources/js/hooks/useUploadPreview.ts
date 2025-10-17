import { Asset } from '@/Utilities/Asset';
import { useEffect, useState } from 'react';

export function isImage(url: string) {
    if (typeof url !== 'string') return false;
    return (
        url.endsWith('.png') ||
        url.endsWith('.jpg') ||
        url.endsWith('.jpeg') ||
        url.endsWith('.gif') ||
        url.endsWith('.webp')
    );
}

export default function useUploadPreview(
    file?:
        | File
        | { path: string; disk: string; mime_type: string; size: number; filename: string }
        | null
) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        if (typeof file === 'object' && 'path' in file) {
            setPreviewUrl(Asset(file.path));
            return;
        }

        if (!(file as File).type.startsWith('image/')) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file as File);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    return previewUrl;
}
