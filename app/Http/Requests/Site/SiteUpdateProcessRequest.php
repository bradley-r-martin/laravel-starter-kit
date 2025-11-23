<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Actions\SiteActions;
use App\Rules\AddressRule;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteUpdateProcessRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'address' => ['nullable', new AddressRule()],
            'opening_hours' => 'nullable|array',
        ];
    }

    public function respond(): Response
    {
        $data = $this->validated();
        new SiteActions((string) $this->route('site'))->update($data);

        return redirect()
            ->route('sites.show', (string) $this->route('site'))
            ->with('toast', [
                'message' => 'Site updated successfully',
                'type' => 'success',
            ]);
    }
}
