<?php

declare(strict_types=1);

namespace App\Http\Requests\PushSubscription;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class DeletePushSubscriptionRequest extends FormRequest
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
        ];
    }

    public function respond(): Response
    {
        /** @var User $user */
        $user = auth()->user();

        $user->deletePushSubscription(
            endpoint: $this->string('endpoint')->toString()
        );

        return redirect()->route('notifications.index')
            ->with('toast', [
                'message' => 'Push subscription deleted successfully',
                'type' => 'success',
            ]);
    }
}
