<?php

declare(strict_types=1);

namespace App\Casts;

use App\Domain\Entity;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * @implements CastsAttributes<Entity, string|null>
 */
final class EntityCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): Entity
    {
        // @phpstan-ignore-next-line: $value is mixed from DB, may be null or string
        return $value ? Entity::fromArray(json_decode((string) $value, true)) : new Entity();
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        // @phpstan-ignore-next-line: $value is mixed, instanceof check is safe
        if ($value instanceof Entity) {
            return json_encode($value->toArray()) ?: null;
        }

        // Ensure always string|null
        return $value ? json_encode($value) ?: null : null;
    }
}
