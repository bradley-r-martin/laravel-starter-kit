<?php

declare(strict_types=1);

namespace App\Http\Controllers\Territory;

use App\Http\Requests\Territory\TerritoryReopenProcessRequest;
use App\Http\Requests\Territory\TerritoryReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryReopenController
{
    public function view(TerritoryReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(TerritoryReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
