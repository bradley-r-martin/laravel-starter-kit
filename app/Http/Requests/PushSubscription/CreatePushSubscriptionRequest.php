<?php

declare(strict_types=1);

namespace App\Http\Requests\PushSubscription;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class CreatePushSubscriptionRequest extends FormRequest
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
        return [
            'endpoint' => ['required', 'string', 'max:500'],
            'keys.p256dh' => ['required', 'string'],
            'keys.auth' => ['required', 'string'],
        ];
    }

    public function respond(): Response
    {
        /** @var User $user */
        $user = auth()->user();

        $user->updatePushSubscription(
            endpoint: $this->string('endpoint')->toString(),
            key: $this->string('keys.p256dh')->toString(),
            token: $this->string('keys.auth')->toString(),
            contentEncoding: $this->string('contentEncoding', 'aesgcm')->toString()
        );

        return redirect()->route('notifications.index')
            ->with('toast', [
                'message' => 'Push subscription created successfully',
                'type' => 'success',
            ]);
    }
}
