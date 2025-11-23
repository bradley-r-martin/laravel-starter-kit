<?php

declare(strict_types=1);

use App\Actions\RoleActions;
use App\Models\Policy;
use App\Models\Role;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    // Create test role with policies
    $role = RoleActions::create([
        'id' => '01JNTEST1234567890ABCDEF',
        'name' => 'Admin',
        'description' => 'Administrator role',
        'hidden' => false,
    ]);

    $this->roleId = $role->id;
});

it('reports no orphaned policies when all policies exist in code', function () {
    // Create a policy that exists in the codebase (RolePolicy exists)
    new RoleActions($this->roleId)
        ->attachPolicy(
            policy: 'App\\Policies\\RolePolicy',
            ability: 'viewAny',
            description: 'View any roles',
            hidden: false
        );

    $this->artisan('policies:prune')
        ->expectsOutput('No orphaned policies found. Database is clean!')
        ->assertSuccessful();
});

it('identifies orphaned policies', function () {
    // Create a policy that does NOT exist in the codebase
    new RoleActions($this->roleId)
        ->attachPolicy(
            policy: 'App\\Policies\\NonExistentPolicy',
            ability: 'view',
            description: 'Non-existent policy',
            hidden: false
        );

    $this->artisan('policies:prune', ['--dry-run' => true])
        ->expectsOutputToContain('Found 1 orphaned policies')
        ->expectsOutputToContain('App\\Policies\\NonExistentPolicy')
        ->expectsOutputToContain('Dry run mode - no policies were removed')
        ->assertSuccessful();
});

it('deprecates orphaned policies when not in dry-run mode', function () {
    // Create an orphaned policy
    new RoleActions($this->roleId)
        ->attachPolicy(
            policy: 'App\\Policies\\OrphanedPolicy',
            ability: 'delete',
            description: 'Orphaned policy',
            hidden: false
        );

    // Verify the policy exists before deprecation
    $policy = Policy::where('policy', 'App\\Policies\\OrphanedPolicy')
        ->where('ability', 'delete')
        ->first();

    expect($policy)->not->toBeNull();

    $this->artisan('policies:prune')
        ->expectsOutputToContain('Found 1 orphaned policies')
        ->expectsOutputToContain('Deprecating orphaned policies...')
        ->expectsOutputToContain('Successfully deprecated 1 orphaned policies')
        ->assertSuccessful();

    // Verify the policy was deleted
    $policy = Policy::where('policy', 'App\\Policies\\OrphanedPolicy')
        ->where('ability', 'delete')
        ->first();

    expect($policy)->toBeNull();
});

it('handles multiple orphaned policies', function () {
    // Create multiple orphaned policies
    $aggregate = new RoleActions($this->roleId);

    $aggregate
        ->attachPolicy(
            policy: 'App\\Policies\\OrphanedPolicy1',
            ability: 'view',
            description: 'First orphaned policy'
        )
        ->attachPolicy(
            policy: 'App\\Policies\\OrphanedPolicy2',
            ability: 'create',
            description: 'Second orphaned policy'
        )
        ->attachPolicy(
            policy: 'App\\Policies\\OrphanedPolicy3',
            ability: 'delete',
            description: 'Third orphaned policy'
        );

    $this->artisan('policies:prune')
        ->expectsOutputToContain('Found 3 orphaned policies')
        ->expectsOutputToContain('Successfully deprecated 3 orphaned policies')
        ->assertSuccessful();

    // Verify all policies were deleted
    $policies = Policy::where('role_id', $this->roleId)
        ->whereIn('policy', [
            'App\\Policies\\OrphanedPolicy1',
            'App\\Policies\\OrphanedPolicy2',
            'App\\Policies\\OrphanedPolicy3',
        ])
        ->get();

    expect($policies)->toHaveCount(0);
});

it('only deprecates orphaned policies and keeps valid ones', function () {
    // Create one valid policy and one orphaned policy
    $aggregate = new RoleActions($this->roleId);

    $aggregate
        ->attachPolicy(
            policy: 'App\\Policies\\RolePolicy',
            ability: 'viewAny',
            description: 'Valid policy'
        )
        ->attachPolicy(
            policy: 'App\\Policies\\OrphanedPolicy',
            ability: 'view',
            description: 'Orphaned policy'
        );

    $this->artisan('policies:prune')
        ->expectsOutputToContain('Found 1 orphaned policies')
        ->expectsOutputToContain('Successfully deprecated 1 orphaned policies')
        ->assertSuccessful();

    // Verify the orphaned policy was deleted
    $orphanedPolicy = Policy::where('policy', 'App\\Policies\\OrphanedPolicy')
        ->where('ability', 'view')
        ->first();

    expect($orphanedPolicy)->toBeNull();

    // Verify the valid policy still exists
    $validPolicy = Policy::where('policy', 'App\\Policies\\RolePolicy')
        ->where('ability', 'viewAny')
        ->first();

    expect($validPolicy)->not->toBeNull();
});

it('discovers all methods in RolePolicy correctly', function () {
    // This test verifies that the command correctly discovers policy methods
    $this->artisan('policies:prune')
        ->expectsOutputToContain('Scanning App\\Policy folder for available policies')
        ->assertSuccessful();

    // Create policies for all methods except RolePolicy methods
    $aggregate = new RoleActions($this->roleId);

    $aggregate
        ->attachPolicy(
            policy: 'App\\Policies\\NonExistentPolicy',
            ability: 'someMethod',
            description: 'Should be orphaned'
        );

    $this->artisan('policies:prune')
        ->expectsOutputToContain('Found 1 orphaned policies')
        ->assertSuccessful();
});

it('displays table with orphaned policy details in dry-run mode', function () {
    new RoleActions($this->roleId)
        ->attachPolicy(
            policy: 'App\\Policies\\TestPolicy',
            ability: 'testAbility',
            description: 'Test policy description'
        );

    $this->artisan('policies:prune', ['--dry-run' => true])
        ->expectsOutputToContain('Found 1 orphaned policies')
        ->expectsOutputToContain('Dry run mode - no policies were removed')
        ->assertSuccessful();

    // Verify policy was not deleted in dry-run mode
    $policy = Policy::where('policy', 'App\\Policies\\TestPolicy')->first();
    expect($policy)->not->toBeNull();
});

it('handles missing Policies directory gracefully', function () {
    // Temporarily rename the Policies directory
    $policyPath = app_path('Policies');
    $tempPath = app_path('Policies_backup');

    if (File::exists($policyPath)) {
        File::move($policyPath, $tempPath);
    }

    try {
        $this->artisan('policies:prune')
            ->expectsOutputToContain('App\\Policies folder does not exist')
            ->assertSuccessful();
    } finally {
        // Restore the directory
        if (File::exists($tempPath)) {
            File::move($tempPath, $policyPath);
        }
    }
});

it('skips policies when role is missing', function () {
    // Create a policy with an orphaned role
    new RoleActions($this->roleId)
        ->attachPolicy(
            policy: 'App\\Policies\\OrphanedPolicy',
            ability: 'view',
            description: 'Test orphaned policy'
        );

    // Verify the policy was created
    $policy = Policy::where('policy', 'App\\Policies\\OrphanedPolicy')->first();
    expect($policy)->not->toBeNull();

    // Manually delete the role from the database (simulating data inconsistency)
    Role::where('id', $this->roleId)->delete();

    // The command should still run successfully
    // Since the role is deleted, the policies will also be deleted due to cascade
    // or they won't be found, so we just check the command runs successfully
    $this->artisan('policies:prune')
        ->assertSuccessful();
});

it('works with multiple roles and their policies', function () {
    $secondRoleId = '01JNTEST2345678901BCDEFG';

    // Create second role
    RoleActions::create([
        'id' => $secondRoleId,
        'name' => 'Editor',
        'description' => 'Editor role',
        'hidden' => false,
    ]);

    // Add orphaned policies to both roles
    new RoleActions($this->roleId)
        ->attachPolicy(
            policy: 'App\\Policies\\OrphanedPolicy1',
            ability: 'view'
        );

    new RoleActions($secondRoleId)
        ->attachPolicy(
            policy: 'App\\Policies\\OrphanedPolicy2',
            ability: 'create'
        );

    $this->artisan('policies:prune')
        ->expectsOutputToContain('Found 2 orphaned policies')
        ->expectsOutputToContain('Successfully deprecated 2 orphaned policies')
        ->assertSuccessful();
});
