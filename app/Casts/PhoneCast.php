<?php

declare(strict_types=1);

namespace App\Casts;

use App\Domain\Phone;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * @implements CastsAttributes<Phone, string|null>
 */
final class PhoneCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): Phone
    {
        // @phpstan-ignore-next-line: $value is mixed from DB, may be null or string
        return $value ? Phone::fromArray(json_decode((string) $value, true)) : new Phone();
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        // @phpstan-ignore-next-line: $value is mixed, instanceof check is safe
        if ($value instanceof Phone) {
            return json_encode($value->toArray()) ?: null;
        }

        return $value ? json_encode($value) ?: null : null;
    }
}
