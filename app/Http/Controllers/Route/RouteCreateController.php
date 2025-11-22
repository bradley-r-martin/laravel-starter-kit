<?php

declare(strict_types=1);

namespace App\Http\Controllers\Route;

use App\Http\Requests\Route\RouteCreateProcessRequest;
use App\Http\Requests\Route\RouteCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RouteCreateController
{
    public function view(RouteCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(RouteCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
