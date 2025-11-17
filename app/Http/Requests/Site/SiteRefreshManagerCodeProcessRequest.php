<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Aggregates\SiteAggregate;
use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteRefreshManagerCodeProcessRequest extends FormRequest
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

        /** @var Site $site */
        $site = Site::query()
            ->select(['id'])
            ->findOrFail($siteId);

        SiteAggregate::retrieve($siteId)
            ->refreshManagerCode()
            ->persist();

        return redirect()
            ->route('sites.show', $siteId)
            ->with('toast', [
                'message' => 'Manager code refreshed successfully',
                'type' => 'success',
            ]);
    }
}

