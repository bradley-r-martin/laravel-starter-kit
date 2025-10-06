<?php

declare(strict_types=1);

namespace App\Http\Controllers\Role;

use App\Http\Requests\Role\RoleReopenProcessRequest;
use App\Http\Requests\Role\RoleReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleReopenController
{
    public function view(RoleReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(RoleReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
