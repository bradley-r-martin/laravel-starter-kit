<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Aggregates\SiteAggregate;
use App\Domain\Address;
use App\Models\Site;
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
        $siteId = (string) $this->route('site');

        /** @var Site $site */
        $site = Site::query()
            ->select(['id', 'closed_at'])
            ->findOrFail($siteId);

        // Only non-closed sites can be updated
        if ($site->closed_at !== null) {
            abort(403, 'Closed sites cannot be updated.');
        }

        /** @var array{name?: string, address?: array<string, mixed>|null, opening_hours?: array<int|string, mixed>|null} $data */
        $data = $this->validated();

        $address = null;
        if (isset($data['address'])) {
            /** @var array<string, string|float|null> $addressData */
            $addressData = $data['address'];
            $address = Address::fromArray($addressData);
        }

        /** @var array<int|string, mixed>|null $openingHours */
        $openingHours = $data['opening_hours'] ?? null;

        SiteAggregate::retrieve($siteId)
            ->update(
                name: $data['name'] ?? null,
                address: $address,
                openingHours: $openingHours,
            )
            ->persist();

        return redirect()
            ->route('sites.show', $siteId)
            ->with('toast', [
                'message' => 'Site updated successfully',
                'type' => 'success',
            ]);
    }
}
