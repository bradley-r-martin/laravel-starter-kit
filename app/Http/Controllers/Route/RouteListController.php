<?php

declare(strict_types=1);

namespace App\Http\Controllers\Route;

use App\Http\Requests\Route\RouteListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RouteListController
{
    public function view(RouteListViewRequest $request): Response
    {
        return $request->respond();
    }
}

