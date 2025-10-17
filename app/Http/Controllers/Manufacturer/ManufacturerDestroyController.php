<?php

declare(strict_types=1);

namespace App\Http\Controllers\Manufacturer;

use App\Http\Requests\Manufacturer\ManufacturerDestroyProcessRequest;
use App\Http\Requests\Manufacturer\ManufacturerDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerDestroyController
{
    public function view(ManufacturerDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ManufacturerDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
