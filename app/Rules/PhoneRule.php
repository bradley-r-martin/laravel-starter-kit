<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;

final class PhoneRule implements ValidationRule
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
                "{$attribute}.country_code" => ['nullable', 'string', 'max:10'],
                "{$attribute}.area_code" => ['nullable', 'string', 'max:10'],
                "{$attribute}.number" => ['nullable', 'string', 'max:50'],
                "{$attribute}.extension" => ['nullable', 'string', 'max:10'],
                "{$attribute}.type" => ['nullable', 'string', 'max:50'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $fail($message);
            }
        }
    }
}
