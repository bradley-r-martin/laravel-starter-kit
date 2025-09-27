<?php

declare(strict_types=1);

namespace App\Casts;

use App\Domain\Entity;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

final class EntityCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Entity
    {
        return $value ? Entity::fromArray(json_decode($value, true)) : new Entity();
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value instanceof Entity) {
            return json_encode($value->toArray());
        }

        return $value ? json_encode($value) : null;
    }
}
