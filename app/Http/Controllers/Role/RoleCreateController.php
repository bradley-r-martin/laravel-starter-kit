<?php

declare(strict_types=1);

namespace App\Http\Controllers\Role;

use App\Http\Requests\Role\RoleCreateProcessRequest;
use App\Http\Requests\Role\RoleCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleCreateController
{
    public function view(RoleCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(RoleCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
