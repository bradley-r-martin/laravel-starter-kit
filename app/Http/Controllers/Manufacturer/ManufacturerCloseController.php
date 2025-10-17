<?php

declare(strict_types=1);

namespace App\Http\Controllers\Manufacturer;

use App\Http\Requests\Manufacturer\ManufacturerCloseProcessRequest;
use App\Http\Requests\Manufacturer\ManufacturerCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerCloseController
{
    public function view(ManufacturerCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ManufacturerCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
