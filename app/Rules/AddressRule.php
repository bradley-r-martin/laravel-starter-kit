<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;

final class AddressRule implements ValidationRule
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
                "{$attribute}.place_id" => ['nullable', 'string', 'max:255'],
                "{$attribute}.building_name" => ['nullable', 'string', 'max:255'],
                "{$attribute}.lot_no" => ['nullable', 'string', 'max:255'],
                "{$attribute}.country" => ['nullable', 'string', 'max:255'],
                "{$attribute}.level" => ['nullable', 'string', 'max:255'],
                "{$attribute}.postcode" => ['nullable', 'string', 'max:255'],
                "{$attribute}.state" => ['nullable', 'string', 'max:255'],
                "{$attribute}.street_name" => ['nullable', 'string', 'max:255'],
                "{$attribute}.street_number" => ['nullable', 'string', 'max:255'],
                "{$attribute}.street_type" => ['nullable', 'string', 'max:255'],
                "{$attribute}.street_suffix" => ['nullable', 'string', 'max:255'],
                "{$attribute}.suburb" => ['nullable', 'string', 'max:255'],
                "{$attribute}.unit" => ['nullable', 'string', 'max:255'],
                "{$attribute}.latitude" => ['nullable', 'numeric'],
                "{$attribute}.longitude" => ['nullable', 'numeric'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $fail($message);
            }
        }
    }
}
