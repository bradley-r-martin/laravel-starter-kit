<?php

declare(strict_types=1);

namespace App\Http\Controllers\Nearby;

use App\Http\Requests\Nearby\NearbyPlacementsViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class NearbyPlacementsController
{
    public function view(NearbyPlacementsViewRequest $request): Response
    {
        return $request->respond();
    }
}
