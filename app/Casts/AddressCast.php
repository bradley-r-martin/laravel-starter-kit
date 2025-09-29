<?php

declare(strict_types=1);

namespace App\Casts;

use App\Domain\Address;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * @implements CastsAttributes<Address, string|null>
 */
final class AddressCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): Address
    {
        // @phpstan-ignore-next-line: $value is mixed from DB, may be null or string
        return $value ? Address::fromArray(json_decode((string) $value, true)) : new Address();
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        // @phpstan-ignore-next-line: $value is mixed, instanceof check is safe
        if ($value instanceof Address) {
            return json_encode($value->toArray()) ?: null;
        }

        // Ensure always string|null
        return $value ? json_encode($value) ?: null : null;
    }
}
