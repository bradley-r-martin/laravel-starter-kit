<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;

final class FileRule implements ValidationRule
{
    /**
     * @param  array<string, mixed>|null  $value
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null) {
            return;
        }

        $validator = Validator::make(
            [$attribute => $value],
            [
                $attribute => ['array'],
                "{$attribute}.path" => ['required', 'string'],
                "{$attribute}.disk" => ['required', 'string'],
                "{$attribute}.mime_type" => ['nullable', 'string'],
                "{$attribute}.size" => ['nullable', 'integer'],
                "{$attribute}.filename" => ['nullable', 'string'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $fail($message);
            }
        }
    }
}
