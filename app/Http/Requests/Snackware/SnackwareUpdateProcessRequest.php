<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Actions\SnackwareActions;
use App\Models\Snackware;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareUpdateProcessRequest extends FormRequest
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
            'type' => 'sometimes|string|max:255',
            'icon' => 'nullable|string|max:255',
            'price' => 'sometimes|integer|min:0',
        ];
    }

    public function respond(): Response
    {
        $snackwareId = (string) $this->route('snackware');

        /** @var Snackware $snackware */
        $snackware = Snackware::query()
            ->select(['id', 'closed_at'])
            ->findOrFail($snackwareId);

        // Only non-closed snackwares can be updated
        if ($snackware->closed_at !== null) {
            abort(403, 'Closed snackwares cannot be updated.');
        }

        /** @var array{name?: string, type?: string, icon?: string|null, price?: int} $data */
        $data = $this->validated();

        $updateData = [];
        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        if (isset($data['type'])) {
            $updateData['type'] = $data['type'];
        }
        if (array_key_exists('icon', $data)) {
            $updateData['icon'] = $data['icon'];
        }
        if (isset($data['price'])) {
            $updateData['price'] = $data['price'];
        }

        new SnackwareActions($snackware)->update($updateData);

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Snackware updated successfully',
                'type' => 'success',
            ]);
    }
}
