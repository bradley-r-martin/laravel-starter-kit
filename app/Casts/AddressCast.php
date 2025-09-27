<?php

declare(strict_types=1);

namespace App\Casts;

use App\Domain\Address;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

final class AddressCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Address
    {
        return $value ? Address::fromArray(json_decode($value, true)) : new Address();
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value instanceof Address) {
            return json_encode($value->toArray());
        }

        return $value ? json_encode($value) : null;
    }
}
