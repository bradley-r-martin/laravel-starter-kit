import axios, { AxiosResponse } from 'axios';
import PdfToImagesService from './PdfToImagesService';

export type InvoiceImage = { name: string; blob: Blob };

class InvoiceAnalysisService {
    private readonly SUPPORTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
    private readonly API_ENDPOINT = '/api/invoice-analysis';

    public async analyze<Response = unknown>(
        file: File
    ): Promise<{
        images: InvoiceImage[];
        response: AxiosResponse<Response>;
    }> {
        this.validateFileType(file);

        const images = await this.prepareImages(file);
        const formData = this.createFormData(images);
        const response = await this.submitAnalysis<Response>(formData);

        return { images, response };
    }

    private validateFileType(file: File): void {
        if (!this.SUPPORTED_TYPES.includes(file.type)) {
            throw new Error('Unsupported file type. Please select a PDF, JPEG or PNG file.');
        }
    }

    private async prepareImages(file: File): Promise<InvoiceImage[]> {
        const images: InvoiceImage[] = [];

        if (file.type === 'application/pdf') {
            const pdfImages = await PdfToImagesService.convert(file);
            if (!pdfImages) {
                throw new Error('Error converting PDF to images');
            }
            pdfImages.forEach((image) => {
                images.push({ name: image.name, blob: image.blob });
            });
        } else {
            // If it's an image, we can directly use it as a blob
            images.push({ name: file.name, blob: file });
        }

        return images;
    }

    private createFormData(images: InvoiceImage[]): FormData {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images[]', image.blob, image.name);
        });
        return formData;
    }

    private async submitAnalysis<Response = unknown>(
        formData: FormData
    ): Promise<AxiosResponse<Response>> {
        return axios.post<Response>(this.API_ENDPOINT, formData);
    }
}

export default new InvoiceAnalysisService();
