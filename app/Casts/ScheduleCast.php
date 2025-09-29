<?php

declare(strict_types=1);

namespace App\Casts;

use App\Domain\Schedule;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * @implements CastsAttributes<Schedule|null, string|null>
 */
final class ScheduleCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Schedule
    {
        // @phpstan-ignore-next-line: $value is mixed, from DB
        return Schedule::fromString($value);
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        // @phpstan-ignore-next-line: false positive, generics make PHPStan think instanceof is impossible
        if ($value instanceof Schedule) {
            return (string) $value;
        }

        // Generics guarantee $value is string|null, so no need for redundant checks
        return $value;
    }
}
