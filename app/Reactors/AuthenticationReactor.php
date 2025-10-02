<?php

declare(strict_types=1);

namespace App\Reactors;

use App\Events\User\UserRecoveryRequested;
use App\Models\User;
use App\Notifications\PasswordRecoveryNotification;
use Illuminate\Support\Facades\Password;
use Spatie\EventSourcing\EventHandlers\Reactors\Reactor;

final class AuthenticationReactor extends Reactor
{
    public function onUserRecoveryRequested(UserRecoveryRequested $event): void
    {
        // Find the user by email
        $user = User::query()->where('email', $event->email)->first();

        if (! $user) {
            return;
        }

        // Generate password reset token
        $token = Password::createToken($user);

        // Send the notification
        $user->notify(new PasswordRecoveryNotification($token));
    }
}
