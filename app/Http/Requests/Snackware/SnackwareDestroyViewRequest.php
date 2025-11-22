<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Models\Snackware;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareDestroyViewRequest extends FormRequest
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
        $snackwareId = $this->route('snackware');

        /** @var Snackware $snackware */
        $snackware = Snackware::query()
            ->select(['id', 'name', 'closed_at'])
            ->findOrFail($snackwareId);

        return inertia()
            ->modal('Snackware/Destroy', [
                'snackware' => [
                    'id' => $snackware->id,
                    'name' => $snackware->name,
                    'closed_at' => $snackware->closed_at,
                ],
            ])
            ->baseRoute('snackwares.index')
            ->toResponse($this);
    }
}
