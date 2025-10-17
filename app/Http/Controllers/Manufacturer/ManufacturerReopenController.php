<?php

declare(strict_types=1);

namespace App\Http\Controllers\Manufacturer;

use App\Http\Requests\Manufacturer\ManufacturerReopenProcessRequest;
use App\Http\Requests\Manufacturer\ManufacturerReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerReopenController
{
    public function view(ManufacturerReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ManufacturerReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
