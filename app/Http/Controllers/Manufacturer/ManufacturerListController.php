<?php

declare(strict_types=1);

namespace App\Http\Controllers\Manufacturer;

use App\Http\Requests\Manufacturer\ManufacturerListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerListController
{
    public function view(ManufacturerListViewRequest $request): Response
    {
        return $request->respond();
    }
}
