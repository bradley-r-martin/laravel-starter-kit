<?php

declare(strict_types=1);

namespace App\Actions;

use App\Domain\File;
use App\Models\Operator;
use App\Models\Role;
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
            $user = User::findOrFail($user);
        }
        $this->user = $user;
    }

    public static function create(array $data): User
    {

        // Handle operator
        if (array_key_exists('operator_id', $data)) {
            $data['__operator_name'] = Operator::find($data['operator_id'])?->name;
        }

        // Handle role
        if (array_key_exists('role_id', $data)) {
            $data['__role_name'] = Role::find($data['role_id'])?->name;
            Role::whereKey($data['role_id'])->increment('__users_count');
        }

        // Handle avatar
        if (array_key_exists('avatar', $data)) {
            $data['avatar'] = File::fromArray($data['avatar'])->persist();
        }

        return User::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): User
    {

        // Handle operator
        if (array_key_exists('operator_id', $data)) {
            $data['__operator_name'] = Operator::find($data['operator_id'])?->name;
        }

        // Handle role
        if (array_key_exists('role_id', $data)) {
            $data['__role_name'] = Role::find($data['role_id'])?->name;
            Role::whereKey($data['role_id'])->increment('__users_count');
            Role::whereKey($this->user->role_id)->decrement('__users_count');
        }

        // Handle avatar
        if (array_key_exists('avatar', $data)) {
            if ($this->user->avatar) {
                $this->user->avatar->delete();
            }
            if ($data['avatar'] !== null) {

                $data['avatar'] = File::fromArray($data['avatar'])->persist();
            }
        }

        $this->user->update($data);

        return $this->user;
    }

    public function suspend(bool $notify = false, ?string $reason = null): User
    {
        $this->user->update([
            'suspended_at' => now(),
        ]);

        // Derived data column updates
        Role::whereKey($this->user->role_id)->decrement('__users_count');

        if ($notify) {
            $this->user->notify(new UserSuspensionNotification($reason));
        }

        return $this->user;
    }

    public function unsuspend(bool $notify = false, ?string $reason = null): User
    {
        $this->user->update([
            'suspended_at' => null,
        ]);

        // Derived data column updates
        Role::whereKey($this->user->role_id)->increment('__users_count');

        if ($notify) {
            $this->user->notify(new UserUnsuspensionNotification($reason));
        }

        return $this->user;
    }

    public function close(): User
    {
        $this->user->update([
            'closed_at' => now(),
        ]);

        // Derived data column updates
        Role::whereKey($this->user->role_id)->decrement('__users_count');

        return $this->user;
    }

    public function reopen(): User
    {
        $this->user->update([
            'closed_at' => null,
        ]);

        // Derived data column updates
        Role::whereKey($this->user->role_id)->increment('__users_count');

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
