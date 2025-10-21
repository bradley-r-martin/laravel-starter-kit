<?php

declare(strict_types=1);

namespace App\Http\Requests\Manufacturer;

use App\Models\Manufacturer;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerListViewRequest extends FormRequest
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
        $manufacturers = Manufacturer::query()
            ->select(['id', 'name', 'closed_at', 'created_at', '__products_count'])
            ->orderBy('created_at', 'desc')
            ->filterBySearch($this->string('manufacturers_search')->toString())
            ->paginate(10, ['*'], 'manufacturers_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Manufacturer $manufacturer}> $manufacturers */
            ->through(fn (Manufacturer $manufacturer): array => [
                'id' => $manufacturer->id,
                'name' => $manufacturer->name,
                'closed_at' => $manufacturer->closed_at,
                'created_at' => $manufacturer->created_at,
                'products_count' => $manufacturer->__products_count,
            ]);

        return inertia()
            ->render('Manufacturer/List', [
                'manufacturers' => $manufacturers,
            ])
            ->toResponse($this);
    }
}
