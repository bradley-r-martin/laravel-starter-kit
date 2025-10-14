<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class NotificationDeleteProcessRequest extends FormRequest
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
        $notificationId = (string) $this->route('notification');

        /** @var User $user */
        $user = auth()->user();

        $notification = $user
            ->notifications()
            ->where('id', $notificationId)
            ->firstOrFail();

        $notification->delete();

        return redirect()->route('notifications.index')
            ->with('toast', [
                'message' => 'Notification deleted successfully',
                'type' => 'success',
            ]);
    }
}
