<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Aggregates\SnackwareAggregate;
use App\Models\Snackware;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareDestroyProcessRequest extends FormRequest
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
            'reason' => 'required|string|max:500',
        ];
    }

    public function respond(): Response
    {
        $snackwareId = (string) $this->route('snackware');
        $snackware = Snackware::query()->select(['id', 'closed_at'])->findOrFail($snackwareId);

        // Only closed snackwares can be destroyed
        if ($snackware->closed_at === null) {
            abort(403, 'Only closed snackwares can be destroyed. Please close the snackware first.');
        }

        /** @var array{reason: string} $data */
        $data = $this->validated();

        // Destroy the snackware via event sourcing
        SnackwareAggregate::retrieve($snackwareId)
            ->destroy(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Snackware destroyed successfully',
                'type' => 'success',
            ]);
    }
}

