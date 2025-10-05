<?php

declare(strict_types=1);

namespace App\Http\Controllers\Authentication;

use App\Http\Requests\Authentication\AuthenticationTerritoryProcessRequest;
use App\Http\Requests\Authentication\AuthenticationTerritoryViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationTerritoryController
{
    public function view(AuthenticationTerritoryViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(AuthenticationTerritoryProcessRequest $request): Response
    {
        return $request->respond();
    }
}
