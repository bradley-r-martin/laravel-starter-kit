<?php

declare(strict_types=1);

namespace App\Casts;

use App\ValueObjects\Schedule;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

final class ScheduleCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Schedule
    {
        return Schedule::fromString($value);
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value instanceof Schedule) {
            return (string) $value;
        }

        return $value;
    }
}
