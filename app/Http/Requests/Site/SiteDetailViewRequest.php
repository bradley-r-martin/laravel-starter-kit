<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteDetailViewRequest extends FormRequest
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
        $siteId = (string) $this->route('site');
        $site = Site::query()
            ->findOrFail($siteId);

        return inertia()
            ->render('Site/Detail', [
                'site' => [
                    'id' => $site->id,
                    'name' => $site->name,
                    'address' => $site->address?->toArray(),
                ],
            ])
            ->toResponse($this);
    }
}

