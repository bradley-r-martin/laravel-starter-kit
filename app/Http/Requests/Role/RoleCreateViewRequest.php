<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Models\Policy;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleCreateViewRequest extends FormRequest
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
        return inertia()
            ->modal('Role/Create', [
                'policies' => Policy::available(),
            ])
            ->baseRoute('roles.index')
            ->toResponse($this);
    }
}
