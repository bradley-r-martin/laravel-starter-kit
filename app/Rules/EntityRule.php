<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;

final class EntityRule implements ValidationRule
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
                "{$attribute}.id" => ['nullable', 'string', 'max:255'],
                "{$attribute}.type" => ['nullable', 'string', 'max:255'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $fail($message);
            }
        }
    }
}
