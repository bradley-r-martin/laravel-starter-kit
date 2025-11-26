<?php

declare(strict_types=1);

namespace App\Http\Requests\Route;

use App\Models\Route;
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
        $this->string('routes_status')->toString();

        $routes = Route::query()
            ->owned()
            ->filterBySearch($this->string('routes_search')->toString())
            ->filterSortBy($this->string('routes_sort')->toString())

            ->orderBy('name')
            ->paginate(10, ['*'], 'routes_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Route $route}> $routes */
            ->through(fn (Route $route): array => $route->toArray());

        return inertia()
            ->render('Route/List', [
                'routes' => $routes,
            ])
            ->toResponse($this);
    }
}
