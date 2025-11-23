<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Actions\SiteActions;
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
        new SiteActions((string) $this->route('site'))->refreshManagerCode();

        return redirect()
            ->route('sites.show', (string) $this->route('site'))
            ->with('toast', [
                'message' => 'Manager code refreshed successfully',
                'type' => 'success',
            ]);
    }
}
