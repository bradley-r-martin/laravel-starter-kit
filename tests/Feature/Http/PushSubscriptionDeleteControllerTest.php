<?php

declare(strict_types=1);

use App\Models\User;

it('can delete a push subscription', function (): void {
    ['user' => $user, 'territory' => $territory] = createTestEnvironment();

    $endpoint = 'https://fcm.googleapis.com/fcm/send/test-endpoint';

    // Create subscription
    $user->updatePushSubscription(
        endpoint: $endpoint,
        key: 'test-p256dh-key',
        token: 'test-auth-token',
    );

    // Verify subscription exists
    $this->assertDatabaseHas('push_subscriptions', [
        'subscribable_type' => User::class,
        'subscribable_id' => $user->id,
        'endpoint' => $endpoint,
    ]);

    // Delete subscription
    $response = $this->as($user, $territory)->deleteJson(
        route('push-subscriptions.delete'),
        [
            'endpoint' => $endpoint,
        ]
    );

    $response->assertSuccessful()
        ->assertJson([
            'message' => 'Push subscription deleted successfully',
        ]);

    // Verify subscription was deleted
    $this->assertDatabaseMissing('push_subscriptions', [
        'subscribable_type' => User::class,
        'subscribable_id' => $user->id,
        'endpoint' => $endpoint,
    ]);
});

it('does not fail when deleting non-existent subscription', function (): void {
    ['user' => $user, 'territory' => $territory] = createTestEnvironment();

    $response = $this->as($user, $territory)->deleteJson(
        route('push-subscriptions.delete'),
        [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/non-existent',
        ]
    );

    $response->assertSuccessful();
});

it('only deletes user\'s own subscription', function (): void {
    ['user' => $user1, 'operator' => $operator, 'territory' => $territory] = createTestEnvironment();
    $user2 = createUser($operator, 'Other', 'User', 'other@example.com');

    $endpoint = 'https://fcm.googleapis.com/fcm/send/test-endpoint';

    // Create subscriptions for both users with same endpoint
    $user1->updatePushSubscription(
        endpoint: $endpoint,
        key: 'user1-key',
        token: 'user1-token',
    );

    $user2->updatePushSubscription(
        endpoint: $endpoint,
        key: 'user2-key',
        token: 'user2-token',
    );

    // User 1 deletes their subscription
    $response = $this->as($user1, $territory)->deleteJson(
        route('push-subscriptions.delete'),
        [
            'endpoint' => $endpoint,
        ]
    );

    $response->assertSuccessful();

    // Verify user 1's subscription is deleted
    $this->assertDatabaseMissing('push_subscriptions', [
        'subscribable_type' => User::class,
        'subscribable_id' => $user1->id,
        'endpoint' => $endpoint,
    ]);

    // Verify user 2's subscription still exists
    $this->assertDatabaseHas('push_subscriptions', [
        'subscribable_type' => User::class,
        'subscribable_id' => $user2->id,
        'endpoint' => $endpoint,
    ]);
});

it('requires endpoint to delete push subscription', function (): void {
    ['user' => $user, 'territory' => $territory] = createTestEnvironment();

    $response = $this->as($user, $territory)->deleteJson(
        route('push-subscriptions.delete'),
        []
    );

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['endpoint']);
});

it('requires authentication to delete push subscription', function (): void {
    $response = $this->deleteJson(
        route('push-subscriptions.delete'),
        [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint',
        ]
    );

    $response->assertUnauthorized();
});
