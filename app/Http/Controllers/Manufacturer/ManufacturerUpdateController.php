<?php

declare(strict_types=1);

namespace App\Http\Controllers\Manufacturer;

use App\Http\Requests\Manufacturer\ManufacturerUpdateProcessRequest;
use App\Http\Requests\Manufacturer\ManufacturerUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerUpdateController
{
    public function view(ManufacturerUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ManufacturerUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
