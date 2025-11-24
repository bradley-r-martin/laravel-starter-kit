<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use App\Models\Wholesaler;
use App\Services\InvoiceTextractService;
use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

final class ExpenseAnalyzeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:10240'], // 10MB max per image
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'images.required' => 'At least one image is required',
            'images.*.image' => 'Each file must be an image',
            'images.*.mimes' => 'Images must be in JPEG or PNG format',
            'images.*.max' => 'Each image must not exceed 10MB',
        ];
    }

    public function respond(): Response
    {
        /** @var array{images: array<int, \Illuminate\Http\UploadedFile>} $data */
        $data = $this->validated();

        try {
            // Store uploaded images temporarily and get their paths
            $storedPaths = [];
            $imagePaths = [];
            $uploadedFiles = [];

            foreach ($data['images'] as $image) {
                // Store in temporary location on public disk
                $path = $image->store('temp', 'public');
                if ($path === false) {
                    throw new RuntimeException('Failed to store uploaded image');
                }
                $storedPaths[] = $path;

                // Store file info for response
                $uploadedFiles[] = [
                    'path' => $path,
                    'disk' => 'public',
                    'mime_type' => $image->getClientMimeType(),
                    'size' => $image->getSize(),
                    'filename' => $image->getClientOriginalName(),
                ];

                // Get the absolute path for analysis
                $absolutePath = Storage::disk('public')->path($path);
                $imagePaths[] = $absolutePath;
            }

            // Analyze the invoice using Textract
            $textractService = new InvoiceTextractService;
            $analysisResult = $textractService->analyzeInvoice($imagePaths);

            // Find matching wholesaler if we have a name
            $wholesalerId = null;
            if ($analysisResult['wholesaler_name']) {
                $wholesaler = Wholesaler::query()
                    ->whereNull('closed_at')
                    ->where('name', 'LIKE', '%'.$analysisResult['wholesaler_name'].'%')
                    ->first();

                if ($wholesaler) {
                    $wholesalerId = $wholesaler->id;
                }
            }

            // Format the response for the frontend
            return new JsonResponse([
                'invoice_no' => $analysisResult['invoice_no'],
                'invoice_date' => $analysisResult['invoice_date']?->format('Y-m-d'),
                'wholesaler_id' => $wholesalerId,
                'wholesaler_name' => $analysisResult['wholesaler_name'],
                'expense_items' => $analysisResult['expense_items'],
                'pages' => $uploadedFiles,
            ]);
        } catch (Exception $e) {
            Log::error('Invoice analysis failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return new JsonResponse([
                'message' => 'Failed to analyze invoice: '.$e->getMessage(),
            ], 422);
        }
    }
}
