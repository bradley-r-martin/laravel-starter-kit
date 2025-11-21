<?php

declare(strict_types=1);

namespace App\Http\Controllers\Territory;

use App\Http\Requests\Territory\TerritoryDestroyProcessRequest;
use App\Http\Requests\Territory\TerritoryDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryDestroyController
{
    public function view(TerritoryDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(TerritoryDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}

