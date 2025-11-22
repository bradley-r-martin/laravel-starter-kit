<?php

declare(strict_types=1);

namespace App\Http\Requests\Territory;

use App\Actions\TerritoryActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryReopenProcessRequest extends FormRequest
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
            'reason' => ['required', 'string', 'max:500'],
        ];
    }

    public function respond(): Response
    {

        $this->validated();

        new TerritoryActions((string) $this->route('territory'))->reopen();

        return redirect()
            ->route('territories.index')
            ->with('toast', [
                'message' => 'Territory reopened successfully',
                'type' => 'success',
            ]);
    }
}
