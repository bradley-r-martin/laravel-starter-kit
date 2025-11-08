<?php

declare(strict_types=1);

namespace App\Http\Controllers\Territory;

use App\Http\Requests\Territory\TerritoryCloseProcessRequest;
use App\Http\Requests\Territory\TerritoryCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryCloseController
{
    public function view(TerritoryCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(TerritoryCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
