<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteCloseViewRequest extends FormRequest
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
        $siteId = $this->route('site');

        /** @var Site $site */
        $site = Site::query()
            ->select(['id', 'name', 'closed_at'])
            ->findOrFail($siteId);

        return inertia()
            ->modal('Site/Close', [
                'site' => [
                    'id' => $site->id,
                    'name' => $site->name,
                    'closed_at' => $site->closed_at,
                ],
            ])
            ->baseRoute('sites.show', $site->id)
            ->toResponse($this);
    }
}
