<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

describe('Notifications', function (): void {
    describe('Notification List', function (): void {
        it('displays the notifications page correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Notifications', 3)
                ->assertTitle('Notifications - Laravel')
                ->assertNoJavascriptErrors();
        });

        it('shows empty state when no notifications exist', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Notifications', 3)
                ->assertSee('No notifications found')
                ->assertNoJavascriptErrors();
        });

        it('displays notifications correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create a notification for the user
            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Test notification message'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Notifications', 3)
                ->assertSee('Test notification message')
                ->assertSee('New')
                ->assertSee('1 unread')
                ->assertNoJavascriptErrors();
        });

        it('displays multiple notifications', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create multiple notifications
            for ($i = 1; $i <= 3; $i++) {
                DatabaseNotification::create([
                    'id' => (string) Str::uuid(),
                    'type' => 'App\Notifications\TestNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'data' => ['message' => "Test notification {$i}"],
                    'read_at' => null,
                    'created_at' => now()->subMinutes($i),
                    'updated_at' => now()->subMinutes($i),
                ]);
            }

            $page = $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Notifications', 3)
                ->assertSee('3 unread')
                ->assertNoJavascriptErrors();

            // Verify all notifications are displayed
            for ($i = 1; $i <= 3; $i++) {
                $page->assertSee("Test notification {$i}");
            }
        });

        it('distinguishes between read and unread notifications', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create unread notification
            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Unread notification'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create read notification
            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Read notification'],
                'read_at' => now(),
                'created_at' => now()->subHour(),
                'updated_at' => now(),
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Unread notification', 3)
                ->assertSee('Read notification')
                ->assertSee('1 unread')
                ->assertSee('New') // Badge for unread notification
                ->assertNoJavascriptErrors();
        });

        it('shows mark all as read button only when there are unread notifications', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Visit with no notifications
            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Notifications', 3)
                ->assertDontSee('Mark all as read')
                ->assertNoJavascriptErrors();

            // Create unread notification
            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Unread notification'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Visit with unread notification
            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Mark all as read', 3)
                ->assertNoJavascriptErrors();
        });
    });

    describe('Mark Notification as Read', function (): void {
        it('can mark individual notification as read', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create unread notification
            $notification = DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Test notification'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Test notification', 3)
                ->assertSee('New')
                ->assertSee('1 unread')
                ->assertNoJavascriptErrors()
                ->click('[data-notification-id="'.$notification->id.'"] [aria-label="Mark as read"]')
                ->assertDontSee('New')
                ->assertNoJavascriptErrors();

            // Verify in database
            $notification->refresh();
            expect($notification->read_at)->not->toBeNull();
        });

        it('removes mark as read button after marking as read', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create unread notification
            $notification = DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Test notification'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $page = $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Test notification', 3)
                ->assertNoJavascriptErrors();

            // Verify mark as read button exists
            $page->assertVisible('[data-notification-id="'.$notification->id.'"] [aria-label="Mark as read"]');

            // Mark as read
            $page->click('[data-notification-id="'.$notification->id.'"] [aria-label="Mark as read"]')
                ->assertNoJavascriptErrors();

            // Verify mark as read button is gone
            $page->assertMissing('[data-notification-id="'.$notification->id.'"] [aria-label="Mark as read"]');
        });
    });

    describe('Mark All Notifications as Read', function (): void {
        it('can mark all notifications as read', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create multiple unread notifications
            for ($i = 1; $i <= 3; $i++) {
                DatabaseNotification::create([
                    'id' => (string) Str::uuid(),
                    'type' => 'App\Notifications\TestNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'data' => ['message' => "Test notification {$i}"],
                    'read_at' => null,
                    'created_at' => now()->subMinutes($i),
                    'updated_at' => now()->subMinutes($i),
                ]);
            }

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('3 unread', 3)
                ->assertSee('Mark all as read')
                ->assertNoJavascriptErrors()
                ->click('button:has-text("Mark all as read")')
                ->assertDontSee('unread')
                ->assertDontSee('Mark all as read')
                ->assertDontSee('New')
                ->assertNoJavascriptErrors();

            // Verify all are marked as read in database
            $unreadCount = DatabaseNotification::query()
                ->where('notifiable_id', $user->id)
                ->whereNull('read_at')
                ->count();

            expect($unreadCount)->toBe(0);
        });

        it('hides mark all as read button after marking all as read', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create unread notifications
            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Test notification 1'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Test notification 2'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Mark all as read', 3)
                ->click('button:has-text("Mark all as read")')
                ->assertDontSee('Mark all as read')
                ->assertNoJavascriptErrors();
        });
    });

    describe('Delete Notification', function (): void {
        it('can delete a notification', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create notification
            $notification = DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Test notification to delete'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Test notification to delete', 3)
                ->assertNoJavascriptErrors()
                ->click('[data-notification-id="'.$notification->id.'"] [aria-label="Delete"]')
                ->assertDontSee('Test notification to delete')
                ->assertNoJavascriptErrors();

            // Verify deleted from database
            $deletedNotification = DatabaseNotification::find($notification->id);
            expect($deletedNotification)->toBeNull();
        });

        it('can delete all notifications one by one', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create multiple notifications
            $notificationIds = [];
            for ($i = 1; $i <= 3; $i++) {
                $notification = DatabaseNotification::create([
                    'id' => (string) Str::uuid(),
                    'type' => 'App\Notifications\TestNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'data' => ['message' => "Test notification {$i}"],
                    'read_at' => null,
                    'created_at' => now()->subMinutes($i),
                    'updated_at' => now()->subMinutes($i),
                ]);
                $notificationIds[] = $notification->id;
            }

            $page = $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Test notification 1', 3)
                ->assertSee('Test notification 2')
                ->assertSee('Test notification 3')
                ->assertNoJavascriptErrors();

            // Delete first notification
            $page->click('[data-notification-id="'.$notificationIds[0].'"] [aria-label="Delete"]')
                ->assertDontSee('Test notification 1')
                ->assertSee('Test notification 2')
                ->assertSee('Test notification 3');

            // Delete second notification
            $page->click('[data-notification-id="'.$notificationIds[1].'"] [aria-label="Delete"]')
                ->assertDontSee('Test notification 2')
                ->assertSee('Test notification 3');

            // Delete last notification
            $page->click('[data-notification-id="'.$notificationIds[2].'"] [aria-label="Delete"]')
                ->assertSee('No notifications found')
                ->assertNoJavascriptErrors();

            // Verify all deleted from database
            $remainingCount = DatabaseNotification::query()
                ->where('notifiable_id', $user->id)
                ->count();

            expect($remainingCount)->toBe(0);
        });

        it('updates unread count when deleting unread notification', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            // Create unread notifications
            $notification1 = DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Unread notification 1'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Unread notification 2'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('2 unread', 3)
                ->assertNoJavascriptErrors()
                ->click('[data-notification-id="'.$notification1->id.'"] [aria-label="Delete"]')
                ->assertSee('1 unread')
                ->assertNoJavascriptErrors();
        });
    });

    describe('Notification Display', function (): void {
        it('displays notification timestamps correctly', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            $createdAt = now()->subHours(2);

            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'Test notification'],
                'read_at' => null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Test notification', 3)
                ->assertSee($createdAt->format('d/m/Y H:i'))
                ->assertNoJavascriptErrors();
        });

        it('handles notifications with missing message gracefully', function (): void {
            ['territory' => $territory, 'user' => $user] = createTestEnvironment();

            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\CustomNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['custom_field' => 'Custom value'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('Custom Notification', 3)
                ->assertNoJavascriptErrors();
        });

        it('displays only user\'s own notifications', function (): void {
            ['territory' => $territory, 'user' => $user, 'operator' => $operator] = createTestEnvironment();
            $otherUser = createUser($operator, 'Other', 'User', 'other@example.com');

            // Create notification for current user
            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['message' => 'My notification'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create notification for other user
            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $otherUser->id,
                'data' => ['message' => 'Other user notification'],
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->as($user, $territory)->visit('/notifications')
                ->waitForText('My notification', 3)
                ->assertDontSee('Other user notification')
                ->assertSee('1 unread')
                ->assertNoJavascriptErrors();
        });
    });
});
