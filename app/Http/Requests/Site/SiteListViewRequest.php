<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Models\Site;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteListViewRequest extends FormRequest
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
        $status = $this->string('sites_status')->toString();

        $sites = Site::query()
            ->with(['territory:id,name', 'operator:id,name', 'route:id,name'])
            ->filterSortBy($this->string('sites_sort')->toString())
            ->filterBySearch($this->string('sites_search')->toString())
            ->when($status !== '', fn (Builder $query): Builder => $query->filterByStatus($status))
            ->paginate(10, ['*'], 'sites_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Site $site}> $sites */
            ->through(fn (Site $site): array => [
                'id' => $site->id,
                'name' => $site->name,
                'territory' => $site->territory ? [
                    'id' => $site->territory->id,
                    'name' => $site->territory->name,
                ] : null,
                'operator' => $site->operator ? [
                    'id' => $site->operator->id,
                    'name' => $site->operator->name,
                ] : null,
                'route' => $site->route ? [
                    'id' => $site->route->id,
                    'name' => $site->route->name,
                ] : null,
                'manager_code' => $site->manager_code,
                'closed_at' => $site->closed_at,
                'created_at' => $site->created_at,
            ]);

        return inertia()
            ->render('Site/List', [
                'sites' => $sites,
            ])
            ->toResponse($this);
    }
}
