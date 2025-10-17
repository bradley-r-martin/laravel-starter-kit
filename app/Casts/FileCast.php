<?php

declare(strict_types=1);

namespace App\Casts;

use App\Domain\File;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * @implements CastsAttributes<File, string|null>
 */
final class FileCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): File
    {
        // @phpstan-ignore-next-line: $value is mixed from DB, may be null or string
        return $value ? File::fromArray(json_decode((string) $value, true)) : new File();
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        // @phpstan-ignore-next-line: $value is mixed, instanceof check is safe
        if ($value instanceof File) {
            return json_encode($value->toArray()) ?: null;
        }

        return $value ? json_encode($value) ?: null : null;
    }
}
