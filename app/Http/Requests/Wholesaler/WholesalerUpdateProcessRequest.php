<?php

declare(strict_types=1);

namespace App\Http\Requests\Wholesaler;

use App\Aggregates\WholesalerAggregate;
use App\Models\Wholesaler;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerUpdateProcessRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        /** @var Wholesaler $wholesaler */
        $wholesaler = Wholesaler::findOrFail($this->route('wholesaler'));

        /** @var array{name?: string|null} $data */
        $data = $this->validated();

        WholesalerAggregate::retrieve($wholesaler->id)
            ->update(
                name: $data['name'] ?? null,
            )
            ->persist();

        return redirect()
            ->route('wholesalers.index')
            ->with('toast', [
                'message' => 'Wholesaler updated successfully',
                'type' => 'success',
            ]);
    }
}
