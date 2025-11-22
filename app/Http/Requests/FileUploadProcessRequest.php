<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Domain\File;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class FileUploadProcessRequest extends FormRequest
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
            'file' => ['required', 'file', 'max:10240'], // 10MB max
        ];
    }

    public function respond(): Response
    {
        $uploadedFile = $this->file('file');
        $extension = $uploadedFile->getClientOriginalExtension();
        $uuid = (string) Str::uuid();

        $path = Storage::disk('public')->putFileAs(
            'temp',
            $uploadedFile,
            $uuid.'.'.$extension
        );

        $file = new File(
            path: $path ?: null,
            disk: 'public',
            mime_type: $uploadedFile->getClientMimeType(),
            size: $uploadedFile->getSize(),
            filename: $uploadedFile->getClientOriginalName(),
        );

        return response()->json($file->toArray());
    }
}
