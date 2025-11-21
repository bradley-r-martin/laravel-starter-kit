<?php

declare(strict_types=1);

namespace App\Http\Controllers\Territory;

use App\Http\Requests\Territory\TerritoryListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryListController
{
    public function view(TerritoryListViewRequest $request): Response
    {
        return $request->respond();
    }
}

