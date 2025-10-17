<?php

declare(strict_types=1);

namespace App\Http\Requests\Wholesaler;

use App\Aggregates\WholesalerAggregate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerCreateProcessRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string} $data */
        $data = $this->validated();

        $wholesalerId = (string) Str::ulid();

        WholesalerAggregate::retrieve($wholesalerId)
            ->create(
                name: $data['name'],
            )
            ->persist();

        return redirect()
            ->route('wholesalers.index')
            ->with('toast', [
                'message' => 'Wholesaler created successfully',
                'type' => 'success',
            ]);
    }
}
