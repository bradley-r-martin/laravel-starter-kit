<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Models\Snackware;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareListViewRequest extends FormRequest
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
        $status = $this->string('snackwares_status')->toString();

        $snackwares = Snackware::query()
            ->owned()
            ->with(['territory:id,name', 'operator:id,name'])
            ->filterSortBy($this->string('snackwares_sort')->toString())
            ->filterBySearch($this->string('snackwares_search')->toString())
            ->when($status !== '', fn (Builder $query): Builder => $query->filterByStatus($status))
            ->paginate(10, ['*'], 'snackwares_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Snackware $snackware}> $snackwares */
            ->through(fn (Snackware $snackware): array => [
                'id' => $snackware->id,
                'name' => $snackware->name,
                'type' => $snackware->type,
                'icon' => $snackware->icon,
                'price' => $snackware->price,
                'territory' => $snackware->territory ? [
                    'id' => $snackware->territory->id,
                    'name' => $snackware->territory->name,
                ] : null,
                'operator' => $snackware->operator ? [
                    'id' => $snackware->operator->id,
                    'name' => $snackware->operator->name,
                ] : null,
                'closed_at' => $snackware->closed_at,
                'created_at' => $snackware->created_at,
            ]);

        return inertia()
            ->render('Snackware/List', [
                'snackwares' => $snackwares,
            ])
            ->toResponse($this);
    }
}
