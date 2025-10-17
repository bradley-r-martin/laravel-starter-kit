<?php

declare(strict_types=1);

namespace App\Http\Controllers\Manufacturer;

use App\Http\Requests\Manufacturer\ManufacturerCreateProcessRequest;
use App\Http\Requests\Manufacturer\ManufacturerCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerCreateController
{
    public function view(ManufacturerCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ManufacturerCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
