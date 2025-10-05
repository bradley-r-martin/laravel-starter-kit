<?php

declare(strict_types=1);

use App\Aggregates\UserAggregate;
use App\Models\Operator;
use App\Models\Role;
use App\Models\User;
use App\Notifications\UserSuspensionNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

use function Pest\Laravel\assertDatabaseHas;

describe('User Reactor', function () {
    it('sends suspension notification when notify is true', function () {
        Notification::fake();

        // Create an operator and role
        $operator = Operator::create([
            'id' => (string) Str::ulid(),
            'name' => 'Test Operator',
        ]);

        $role = Role::create([
            'id' => (string) Str::ulid(),
            'name' => 'Test Role',
        ]);

        // Create and persist a user
        $userId = (string) Str::ulid();
        UserAggregate::retrieve($userId)
            ->create(
                operatorId: $operator->id,
                roleId: $role->id,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: Hash::make('password')
            )
            ->persist();

        // Verify user was created
        assertDatabaseHas('users', [
            'id' => $userId,
            'email' => 'john.doe@example.com',
        ]);

        // Suspend the user with notification
        UserAggregate::retrieve($userId)
            ->suspend(
                reason: 'Policy violation',
                notify: true
            )
            ->persist();

        // Get the user
        $user = User::find($userId);

        // Assert notification was sent
        Notification::assertSentTo(
            $user,
            UserSuspensionNotification::class,
            function ($notification) {
                return $notification->reason === 'Policy violation';
            }
        );
    });

    it('does not send suspension notification when notify is false', function () {
        Notification::fake();

        // Create an operator and role
        $operator = Operator::create([
            'id' => (string) Str::ulid(),
            'name' => 'Test Operator',
        ]);

        $role = Role::create([
            'id' => (string) Str::ulid(),
            'name' => 'Test Role',
        ]);

        // Create and persist a user
        $userId = (string) Str::ulid();
        UserAggregate::retrieve($userId)
            ->create(
                operatorId: $operator->id,
                roleId: $role->id,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                password: Hash::make('password')
            )
            ->persist();

        // Suspend the user without notification
        UserAggregate::retrieve($userId)
            ->suspend(
                reason: 'Policy violation',
                notify: false
            )
            ->persist();

        // Assert no notification was sent
        Notification::assertNothingSent();
    });
});
