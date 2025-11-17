<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Models\Operator;
use App\Models\Route;
use App\Models\Territory;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteCreateViewRequest extends FormRequest
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
        $territories = Territory::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Territory $territory): array => [
                'id' => $territory->id,
                'name' => $territory->name,
            ]);

        $operators = Operator::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Operator $operator): array => [
                'id' => $operator->id,
                'name' => $operator->name,
            ]);

        $routes = Route::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Route $route): array => [
                'id' => $route->id,
                'name' => $route->name,
            ]);

        return inertia()
            ->modal('Site/Create', [
                'territories' => $territories,
                'operators' => $operators,
                'routes' => $routes,
            ])
            ->baseRoute('sites.index')
            ->toResponse($this);
    }
}
