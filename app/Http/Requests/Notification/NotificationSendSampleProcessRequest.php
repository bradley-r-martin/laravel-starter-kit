<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Models\User;
use App\Notifications\SampleNotification;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class NotificationSendSampleProcessRequest extends FormRequest
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

        $user->notify(new SampleNotification(
            title: 'Sample Notification',
            message: 'This is a sample notification sent at '.now()->format('H:i:s'),
        ));

        return redirect()->route('notifications.index')
            ->with('toast', [
                'message' => 'Sample notification sent successfully',
                'type' => 'success',
            ]);
    }
}
