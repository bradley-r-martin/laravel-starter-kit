<?php

declare(strict_types=1);

namespace App\Http\Controllers\Role;

use App\Http\Requests\Role\RoleCloseProcessRequest;
use App\Http\Requests\Role\RoleCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleCloseController
{
    public function view(RoleCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(RoleCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
