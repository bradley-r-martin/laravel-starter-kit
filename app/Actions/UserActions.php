<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Operator;
use App\Models\User;
use App\Notifications\UserSuspensionNotification;
use App\Notifications\UserUnsuspensionNotification;
use DateTimeImmutable;

final class UserActions
{
    public User $user;

    public function __construct(
        User|string $user,
    ) {
        if (is_string($user)) {
            /** @var User $user */
            $user = User::findOrFail($user);
        }
        $this->user = $user;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): User
    {
        // Add denormalized fields
        if (isset($data['operator_id'])) {
            /** @var Operator $operator */
            $operator = Operator::findOrFail($data['operator_id']);
            $data['__operator_name'] = $operator->name;
        }

        return User::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): User
    {
        // Update denormalized operator name if operator_id changed
        if (isset($data['operator_id']) && $data['operator_id'] !== $this->user->operator_id) {
            /** @var Operator $operator */
            $operator = Operator::findOrFail($data['operator_id']);
            $data['__operator_name'] = $operator->name;
        }

        $this->user->update($data);

        return $this->user;
    }

    public function suspend(bool $notify = false, ?string $reason = null): User
    {
        $this->user->update([
            'suspended_at' => now(),
        ]);

        if ($notify && $reason) {
            $this->user->notify(new UserSuspensionNotification($reason));
        }

        return $this->user;
    }

    public function unsuspend(bool $notify = false, ?string $reason = null): User
    {
        $this->user->update([
            'suspended_at' => null,
        ]);

        if ($notify && $reason) {
            $this->user->notify(new UserUnsuspensionNotification($reason));
        }

        return $this->user;
    }

    public function close(): User
    {
        $this->user->update([
            'closed_at' => now(),
        ]);

        return $this->user;
    }

    public function reopen(): User
    {
        $this->user->update([
            'closed_at' => null,
        ]);

        return $this->user;
    }

    public function destroy(): void
    {
        $this->user->delete();
    }

    public function changePassword(string $hashedPassword): User
    {
        $this->user->update([
            'password' => $hashedPassword,
        ]);

        return $this->user;
    }

    public function login(
        string $ipAddress,
        string $userAgent,
        DateTimeImmutable $timestamp
    ): User {
        $this->user->update([
            '__last_login_at' => $timestamp,
            '__last_login_ip' => $ipAddress,
            '__last_login_user_agent' => $userAgent,
        ]);

        return $this->user;
    }
}
