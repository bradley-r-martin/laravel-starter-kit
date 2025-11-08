<?php

declare(strict_types=1);

namespace App\Http\Controllers\Territory;

use App\Http\Requests\Territory\TerritoryUpdateProcessRequest;
use App\Http\Requests\Territory\TerritoryUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryUpdateController
{
    public function view(TerritoryUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(TerritoryUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
