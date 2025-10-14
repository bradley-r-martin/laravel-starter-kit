<?php

declare(strict_types=1);

use App\Models\User;
use NotificationChannels\WebPush\PushSubscription;

it('can create a push subscription', function (): void {
    ['user' => $user, 'territory' => $territory] = createTestEnvironment();

    $subscriptionData = [
        'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint',
        'keys' => [
            'p256dh' => 'test-p256dh-key',
            'auth' => 'test-auth-token',
        ],
    ];

    $response = $this->as($user, $territory)->postJson(
        route('push-subscriptions.create'),
        $subscriptionData
    );

    $response->assertSuccessful()
        ->assertJson([
            'message' => 'Push subscription created successfully',
        ]);

    // Verify subscription was created
    $this->assertDatabaseHas('push_subscriptions', [
        'subscribable_type' => User::class,
        'subscribable_id' => $user->id,
        'endpoint' => $subscriptionData['endpoint'],
    ]);
});

it('updates existing push subscription with same endpoint', function (): void {
    ['user' => $user, 'territory' => $territory] = createTestEnvironment();

    $endpoint = 'https://fcm.googleapis.com/fcm/send/test-endpoint';

    // Create initial subscription
    $user->updatePushSubscription(
        endpoint: $endpoint,
        key: 'old-key',
        token: 'old-token',
    );

    // Update with new keys
    $response = $this->as($user, $territory)->postJson(
        route('push-subscriptions.create'),
        [
            'endpoint' => $endpoint,
            'keys' => [
                'p256dh' => 'new-p256dh-key',
                'auth' => 'new-auth-token',
            ],
        ]
    );

    $response->assertSuccessful();

    // Verify only one subscription exists
    $subscriptionCount = PushSubscription::query()
        ->where('subscribable_type', User::class)
        ->where('subscribable_id', $user->id)
        ->where('endpoint', $endpoint)
        ->count();

    expect($subscriptionCount)->toBe(1);
});

it('requires endpoint to create push subscription', function (): void {
    ['user' => $user, 'territory' => $territory] = createTestEnvironment();

    $response = $this->as($user, $territory)->postJson(
        route('push-subscriptions.create'),
        [
            'keys' => [
                'p256dh' => 'test-p256dh-key',
                'auth' => 'test-auth-token',
            ],
        ]
    );

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['endpoint']);
});

it('requires p256dh key to create push subscription', function (): void {
    ['user' => $user, 'territory' => $territory] = createTestEnvironment();

    $response = $this->as($user, $territory)->postJson(
        route('push-subscriptions.create'),
        [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint',
            'keys' => [
                'auth' => 'test-auth-token',
            ],
        ]
    );

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['keys.p256dh']);
});

it('requires auth token to create push subscription', function (): void {
    ['user' => $user, 'territory' => $territory] = createTestEnvironment();

    $response = $this->as($user, $territory)->postJson(
        route('push-subscriptions.create'),
        [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint',
            'keys' => [
                'p256dh' => 'test-p256dh-key',
            ],
        ]
    );

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['keys.auth']);
});

it('requires authentication to create push subscription', function (): void {
    $response = $this->postJson(
        route('push-subscriptions.create'),
        [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint',
            'keys' => [
                'p256dh' => 'test-p256dh-key',
                'auth' => 'test-auth-token',
            ],
        ]
    );

    $response->assertUnauthorized();
});
