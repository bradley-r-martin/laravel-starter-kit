<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Aggregates\RoleAggregate;
use App\Models\Policy;
use App\Models\Role;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use ReflectionClass;
use ReflectionMethod;

final class PolicyCleanupCommand extends Command
{
    protected $signature = 'policies:cleanup 
                            {--dry-run : Show what would be removed without actually removing}
                            {--force : Force removal without confirmation}';

    protected $description = 'Compare App\\Policy folder with database policies and remove orphaned policies';

    public function handle(): int
    {
        $this->info('Scanning App\\Policy folder for available policies...');

        $availablePolicies = $this->discoverPolicies();
        $this->info("Found {$availablePolicies->count()} policies in App\\Policy folder");

        $databasePolicies = Policy::all();
        $this->info("Found {$databasePolicies->count()} policies in database");

        $orphanedPolicies = $this->findOrphanedPolicies($availablePolicies, $databasePolicies);

        if ($orphanedPolicies->isEmpty()) {
            $this->info('No orphaned policies found. Database is clean!');

            return self::SUCCESS;
        }

        $this->warn("Found {$orphanedPolicies->count()} orphaned policies:");
        $this->displayOrphanedPolicies($orphanedPolicies);

        if ($this->option('dry-run')) {
            $this->info('Dry run mode - no policies were removed');

            return self::SUCCESS;
        }

        $this->removeOrphanedPolicies($orphanedPolicies);

        return self::SUCCESS;
    }

    /**
     * @return Collection<int, array{policy: string, ability: string}>
     */
    private function discoverPolicies(): Collection
    {
        $policyPath = app_path('Policies');

        if (! File::exists($policyPath)) {
            $this->warn('App\\Policies folder does not exist');

            /** @var Collection<int, array{policy: string, ability: string}> */
            return collect();
        }

        /** @var Collection<int, array{policy: string, ability: string}> $policies */
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
                    $policies->push([
                        'policy' => $className,
                        'ability' => $method->getName(),
                    ]);
                }
            } catch (Exception $e) {
                $this->warn("Could not analyze class {$className}: {$e->getMessage()}");
            }
        }

        return $policies;
    }

    /**
     * @param  Collection<int, array{policy: string, ability: string}>  $availablePolicies
     * @param  EloquentCollection<int, Policy>  $databasePolicies
     * @return Collection<int, Policy>
     */
    private function findOrphanedPolicies(
        Collection $availablePolicies,
        EloquentCollection $databasePolicies
    ): Collection {
        $availablePoliciesSet = $availablePolicies->map(fn (array $policy): string => $policy['policy'].'@'.$policy['ability'])->flip();

        return $databasePolicies->filter(function (Policy $dbPolicy) use ($availablePoliciesSet): bool {
            $policyKey = $dbPolicy->policy.'@'.$dbPolicy->ability;

            return ! $availablePoliciesSet->has($policyKey);
        });
    }

    /**
     * @param  Collection<int, Policy>  $orphanedPolicies
     */
    private function displayOrphanedPolicies(Collection $orphanedPolicies): void
    {
        $headers = ['ID', 'Role', 'Policy', 'Ability', 'Description'];
        $rows = $orphanedPolicies->map(fn (Policy $policy): array => [
            $policy->id,
            $policy->role->name ?? 'Unknown',
            $policy->policy,
            $policy->ability,
            $policy->description,
        ])->toArray();

        $this->table($headers, $rows);
    }

    /**
     * @param  Collection<int, Policy>  $orphanedPolicies
     */
    private function removeOrphanedPolicies(Collection $orphanedPolicies): void
    {
        $this->info('Deprecating orphaned policies...');

        $progressBar = $this->output->createProgressBar($orphanedPolicies->count());
        $progressBar->start();

        $deprecatedCount = 0;

        foreach ($orphanedPolicies as $policy) {
            try {
                $role = Role::find($policy->role_id);

                if (! $role) {
                    $this->warn("Role not found for policy {$policy->id}, skipping...");
                    $progressBar->advance();

                    continue;
                }

                $roleAggregate = RoleAggregate::retrieve((string) $role->id);
                $roleAggregate->deprecatePolicy(
                    policy: $policy->policy,
                    ability: $policy->ability
                );
                $roleAggregate->persist();

                $deprecatedCount++;
            } catch (Exception $e) {
                $this->error("Failed to deprecate policy {$policy->id}: {$e->getMessage()}");
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();

        $this->info("Successfully deprecated {$deprecatedCount} orphaned policies");
    }
}
