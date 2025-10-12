<?php

declare(strict_types=1);

namespace App\Http\Controllers\Nearby;

use App\Http\Requests\Nearby\NearbyPlacementViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class NearbyPlacementController
{
    public function view(NearbyPlacementViewRequest $request): Response
    {
        return $request->respond();
    }
}
