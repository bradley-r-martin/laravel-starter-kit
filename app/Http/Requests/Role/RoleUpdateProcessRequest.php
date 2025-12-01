<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Actions\RoleActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleUpdateProcessRequest extends FormRequest
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
            'description' => 'sometimes|required|string|max:255',
            'hidden' => 'sometimes|boolean',
            'policies' => 'sometimes|array',
            'policies.*' => 'string',
        ];
    }

    public function respond(): Response
    {
        /** @var array{name?: string, description?: string, hidden?: bool, policies?: array<int, string>} $data */
        $data = $this->validated();

        new RoleActions((string) $this->route('role'))->update($data);

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role updated successfully',
                'type' => 'success',
            ]);
    }
}
