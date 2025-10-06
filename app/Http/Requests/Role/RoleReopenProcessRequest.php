<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Aggregates\RoleAggregate;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleReopenProcessRequest extends FormRequest
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
        $roleId = (string) $this->route('role');

        /** @var array{reason: string} $data */
        $data = $this->validated();

        RoleAggregate::retrieve($roleId)
            ->reopen(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role reopened successfully',
                'type' => 'success',
            ]);
    }
}
