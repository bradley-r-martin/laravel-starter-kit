<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Actions\SnackwareActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareReopenProcessRequest extends FormRequest
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
        $this->validated();

        new SnackwareActions((string) $this->route('snackware'))->reopen();

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Snackware reopened successfully',
                'type' => 'success',
            ]);
    }
}
