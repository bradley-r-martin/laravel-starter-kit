<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Aggregates\SiteAggregate;
use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteReopenProcessRequest extends FormRequest
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
        return [
            'reason' => 'required|string|max:500',
        ];
    }

    public function respond(): Response
    {
        $siteId = (string) $this->route('site');

        /** @var Site $site */
        $site = Site::query()
            ->select(['id', 'closed_at'])
            ->findOrFail($siteId);

        if ($site->closed_at === null) {
            abort(403, 'Site is not closed.');
        }

        /** @var array{reason: string} $data */
        $data = $this->validated();

        SiteAggregate::retrieve($siteId)
            ->reopen(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('sites.show', $siteId)
            ->with('toast', [
                'message' => 'Site reopened successfully',
                'type' => 'success',
            ]);
    }
}

