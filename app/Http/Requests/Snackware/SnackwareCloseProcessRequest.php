<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Aggregates\SnackwareAggregate;
use App\Models\Snackware;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareCloseProcessRequest extends FormRequest
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
        $snackware = Snackware::query()->select(['id', '__placements_count'])->findOrFail($snackwareId);

        if ($snackware->__placements_count > 0) {
            abort(403, 'Cannot close a snackware that has placements. Please remove all placements before closing.');
        }

        /** @var array{reason: string} $data */
        $data = $this->validated();

        SnackwareAggregate::retrieve($snackwareId)
            ->close(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Snackware closed successfully',
                'type' => 'success',
            ]);
    }
}
