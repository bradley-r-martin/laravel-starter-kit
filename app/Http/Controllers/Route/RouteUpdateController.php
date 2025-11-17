<?php

declare(strict_types=1);

namespace App\Http\Controllers\Route;

use App\Http\Requests\Route\RouteUpdateProcessRequest;
use App\Http\Requests\Route\RouteUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RouteUpdateController
{
    public function view(RouteUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(RouteUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
