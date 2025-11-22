import { UploadedFile } from '@/Types';
import axios from 'axios';

class FileUploadService {
    public async upload(file: File): Promise<UploadedFile> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post<UploadedFile>(route('file-upload'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
}

export default new FileUploadService();
