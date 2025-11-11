import { UploadedFile } from '@/Types';

export function Asset(file: UploadedFile | null) {
    if (!file) return null;
    return `/storage/${file.path.replace(/^\/+/, '')}`;
}
