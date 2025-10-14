<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Notifications\DatabaseNotification;
use Symfony\Component\HttpFoundation\Response;

final class NotificationListViewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }

    public function respond(): Response
    {

        /** @var User $user */
        $user = auth()->user();

        $notifications = $user
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{DatabaseNotification $notification}> $notifications */
            ->through(fn (DatabaseNotification $notification): array => [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ]);

        $unreadCount = $user->unreadNotifications()->count();

        return inertia()
            ->render('Notification/List', [
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
            ])
            ->toResponse($this);
    }
}
