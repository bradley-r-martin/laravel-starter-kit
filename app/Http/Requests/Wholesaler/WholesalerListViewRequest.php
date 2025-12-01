<?php

declare(strict_types=1);

namespace App\Http\Requests\Wholesaler;

use App\Models\Wholesaler;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerListViewRequest extends FormRequest
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
        $wholesalers = Wholesaler::query()
            ->orderBy('created_at', 'desc')
            ->filterBySearch($this->string('wholesalers_search')->toString())
            ->paginate(10, ['*'], 'wholesalers_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Wholesaler $wholesaler}> $wholesalers */
            ->through(fn (Wholesaler $wholesaler): array => $wholesaler->toArray());

        return inertia()
            ->render('Wholesaler/List', [
                'wholesalers' => $wholesalers,
            ])
            ->toResponse($this);
    }
}
