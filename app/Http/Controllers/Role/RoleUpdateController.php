<?php

declare(strict_types=1);

namespace App\Http\Controllers\Role;

use App\Http\Requests\Role\RoleUpdateProcessRequest;
use App\Http\Requests\Role\RoleUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleUpdateController
{
    public function view(RoleUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(RoleUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
