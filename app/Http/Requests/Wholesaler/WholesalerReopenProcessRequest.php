<?php

declare(strict_types=1);

namespace App\Http\Requests\Wholesaler;

use App\Aggregates\WholesalerAggregate;
use App\Models\Wholesaler;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerReopenProcessRequest extends FormRequest
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
        $wholesalerId = (string) $this->route('wholesaler');
        $wholesaler = Wholesaler::query()->select(['id'])->findOrFail($wholesalerId);

        /** @var array{reason: string} $data */
        $data = $this->validated();

        WholesalerAggregate::retrieve($wholesaler->id)
            ->reopen(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('wholesalers.index')
            ->with('toast', [
                'message' => 'Wholesaler reopened successfully',
                'type' => 'success',
            ]);
    }
}
