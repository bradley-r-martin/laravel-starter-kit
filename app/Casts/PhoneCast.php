<?php

declare(strict_types=1);

namespace App\Casts;

use App\ValueObjects\Phone;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

final class PhoneCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Phone
    {
        return $value ? Phone::fromArray(json_decode($value, true)) : new Phone();
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value instanceof Phone) {
            return json_encode($value->toArray());
        }

        return $value ? json_encode($value) : null;
    }
}
