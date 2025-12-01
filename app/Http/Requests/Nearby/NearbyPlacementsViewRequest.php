<?php

declare(strict_types=1);

namespace App\Http\Requests\Nearby;

use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final class NearbyPlacementsViewRequest extends FormRequest
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

    public function nearby()
    {
        $radius = 0.2; // 200 meters
        $latitude = (float) $this->query('latitude', 0);
        $longitude = (float) $this->query('longitude', 0);

        // Get sites within 200m of the given latitude and longitude, using address.latitude and address.longitude
        $sites = Site::query()
            ->filterNearby($latitude, $longitude, $radius)
            ->get();

        return $sites;
    }

    public function respond(): Response
    {

        return inertia()->render('Nearby/Placements', [
            'nearby' => Inertia::defer(fn () => $this->nearby()),
        ])->toResponse($this);
    }
}
