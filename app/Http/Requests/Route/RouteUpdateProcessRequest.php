<?php

declare(strict_types=1);

namespace App\Http\Requests\Route;

use App\Actions\RouteActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RouteUpdateProcessRequest extends FormRequest
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
            'schedule' => 'nullable|string',
        ];
    }

    public function respond(): Response
    {
        $data = $this->validated();
        new RouteActions((string) $this->route('route'))->update($data);

        return redirect()
            ->route('routes.index')
            ->with('toast', [
                'message' => 'Route updated successfully',
                'type' => 'success',
            ]);
    }
}
