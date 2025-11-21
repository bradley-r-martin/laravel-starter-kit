<?php

declare(strict_types=1);

namespace App\Http\Controllers\Territory;

use App\Http\Requests\Territory\TerritoryCreateProcessRequest;
use App\Http\Requests\Territory\TerritoryCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryCreateController
{
    public function view(TerritoryCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(TerritoryCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}

