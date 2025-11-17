<?php

declare(strict_types=1);

namespace App\Http\Requests\Route;

use App\Models\Route;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RouteListViewRequest extends FormRequest
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
        $status = $this->string('routes_status')->toString();

        $routes = Route::query()
            ->with(['territory:id,name', 'operator:id,name'])
            ->filterBySearch($this->string('routes_search')->toString())
            ->when($status !== '', fn (Builder $query): Builder => $query->where(fn (Builder $q) => $q
                ->when($status === 'closed', fn (Builder $q) => $q->whereNotNull('closed_at'))
                ->when($status === 'active', fn (Builder $q) => $q->whereNull('closed_at'))
            ))
            ->orderBy('name')
            ->paginate(10, ['*'], 'routes_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Route $route}> $routes */
            ->through(fn (Route $route): array => [
                'id' => $route->id,
                'name' => $route->name,
                'territory' => $route->territory ? [
                    'id' => $route->territory->id,
                    'name' => $route->territory->name,
                ] : null,
                'operator' => $route->operator ? [
                    'id' => $route->operator->id,
                    'name' => $route->operator->name,
                ] : null,
                'closed_at' => $route->closed_at,
                'created_at' => $route->created_at,
            ]);

        return inertia()
            ->render('Route/List', [
                'routes' => $routes,
            ])
            ->toResponse($this);
    }
}
