declare global {
    interface Window {
        __pdfjsScriptPromise__: Promise<void>;
        pdfjsLib: any;
    }
}

export type PDFToImages = { name: string; blob: Blob }[];

class PdfToImagesService {
    private SCRIPT_ID: string = 'pdfjs-script';
    private SCRIPT_URL: string = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    private WORKER_URL: string =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    public convert(file: File): Promise<PDFToImages | null> {
        return new Promise<PDFToImages | null>((resolve, reject) => {
            this.initialize()
                .then(() => {
                    this.performConversion(file)
                        .then((result) => resolve(result))
                        .catch((error) => reject(new Error('Error converting PDF: ' + error)));
                })
                .catch((error) => {
                    reject(new Error('Error initializing PDF.js: ' + error));
                });
        });
    }

    private async performConversion(file: File): Promise<PDFToImages | null> {
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = this.WORKER_URL;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const data = [] as PDFToImages;
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.5 });

            // ✅ Create off-screen canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;

            // ✅ Convert to blob
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, 'image/png')
            );

            if (blob) {
                data.push({ name: `page-${pageNum}.png`, blob });
            }

            // ✅ Clean up
            canvas.width = 0;
            canvas.height = 0;
        }

        return data;
    }

    initialize() {
        if (window.__pdfjsScriptPromise__) {
            return window.__pdfjsScriptPromise__;
        }

        window.__pdfjsScriptPromise__ = new Promise<void>((resolve, reject) => {
            let script = document.getElementById(this.SCRIPT_ID) as HTMLScriptElement | null;

            // If script tag doesn't exist, create it
            if (!script) {
                script = document.createElement('script');
                script.id = this.SCRIPT_ID;
                script.async = true;
                script.defer = true;
                script.src = this.SCRIPT_URL;
                document.head.appendChild(script);
            }

            // If already loaded (PDF.js defines this on window)
            if (window.pdfjsLib) {
                resolve();
                return;
            }

            // Add listeners
            script.addEventListener('load', () => resolve(), { once: true });

            script.addEventListener(
                'error',
                () => reject(new Error('PDF.js script failed to load.')),
                { once: true }
            );
        });

        return window.__pdfjsScriptPromise__;
    }
}

export default new PdfToImagesService();
