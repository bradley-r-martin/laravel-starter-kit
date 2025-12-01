<?php

declare(strict_types=1);

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use ReflectionClass;
use ReflectionMethod;

final class Policy extends Model
{
    use HasUlids;

    /**
     * Discover all available policies from the app/Policies directory.
     *
     * @return Collection<int, array{value: string, label: string, group: string}>
     */
    public static function available(): Collection
    {
        $path = app_path('Policies');

        if (! File::exists($path)) {
            /** @var Collection<int, array{value: string, label: string, group: string}> */
            return collect();
        }

        /** @var Collection<int, array{value: string, label: string, group: string}> $policies */
        $policies = collect();
        $files = File::allFiles($path);

        foreach ($files as $file) {
            if ($file->getExtension() !== 'php') {
                continue;
            }

            $className = 'App\\Policies\\'.$file->getFilenameWithoutExtension();

            if (! class_exists($className)) {
                continue;
            }

            try {
                $reflection = new ReflectionClass($className);
                if ($reflection->isAbstract()) {
                    continue;
                }
                if ($reflection->isInterface()) {
                    continue;
                }

                $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);
                $policyName = $file->getFilenameWithoutExtension();

                foreach ($methods as $method) {
                    if ($method->isConstructor()) {
                        continue;
                    }
                    if ($method->isDestructor()) {
                        continue;
                    }
                    if ($method->isStatic()) {
                        continue;
                    }
                    // Skip private helper methods
                    if (str_starts_with($method->getName(), '_')) {
                        continue;
                    }
                    if ($method->getName() === 'isAuthorized') {
                        continue;
                    }
                    if ($method->getName() === 'isDeveloper') {
                        continue;
                    }

                    $policies->push([
                        'namespace' => $className.'@'.$method->getName(),
                        'policy' => str_replace('Policy', '', class_basename($className)),
                        'ability' => ucfirst(preg_replace('/(?<!^)[A-Z]/', ' $0', $method->getName())),
                    ]);
                }
            } catch (Exception) {
                // Skip policies that cannot be analyzed
                continue;
            }
        }

        return $policies->sortBy('group')->values();
    }

    /**
     * Get the role.
     *
     * @return BelongsTo<Role, $this>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    protected function casts(): array
    {
        return [
            'hidden' => 'boolean',
        ];
    }
}
