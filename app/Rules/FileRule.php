<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;

final class FileRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null) {
            return;
        }

        if (! is_array($value)) {
            $fail("The {$attribute} must be a valid file object.");

            return;
        }

        // Use a simple key for validation to avoid dot notation issues
        $validator = Validator::make(
            ['file' => $value],
            [
                'file' => ['array'],
                'file.path' => ['required', 'string'],
                'file.disk' => ['required', 'string'],
                'file.mime_type' => ['nullable', 'string'],
                'file.size' => ['nullable', 'integer'],
                'file.filename' => ['nullable', 'string'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                // Replace 'file' with the actual attribute name in error messages
                $message = str_replace('file', $attribute, $message);
                $fail($message);
            }
        }
    }
}
