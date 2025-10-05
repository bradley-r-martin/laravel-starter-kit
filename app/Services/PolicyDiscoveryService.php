<?php

declare(strict_types=1);

namespace App\Services;

use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use ReflectionClass;
use ReflectionMethod;

final class PolicyDiscoveryService
{
    /**
     * Discover all available policies from the app/Policies directory.
     *
     * @return Collection<int, array{value: string, label: string, group: string}>
     */
    public function discoverAvailablePolicies(): Collection
    {
        $policyPath = app_path('Policies');

        if (! File::exists($policyPath)) {
            /** @var Collection<int, array{value: string, label: string, group: string}> */
            return collect();
        }

        /** @var Collection<int, array{value: string, label: string, group: string}> $policies */
        $policies = collect();
        $files = File::allFiles($policyPath);

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
                        'value' => $className.'@'.$method->getName(),
                        'label' => $this->formatAbilityLabel($method->getName()),
                        'group' => $policyName,
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
     * Format ability name to a readable label.
     */
    private function formatAbilityLabel(string $ability): string
    {
        // Convert camelCase to Title Case
        $formatted = preg_replace('/(?<!^)[A-Z]/', ' $0', $ability);

        return ucfirst($formatted ?? $ability);
    }
}
