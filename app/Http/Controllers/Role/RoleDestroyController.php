<?php

declare(strict_types=1);

namespace App\Http\Controllers\Role;

use App\Http\Requests\Role\RoleDestroyProcessRequest;
use App\Http\Requests\Role\RoleDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleDestroyController
{
    public function view(RoleDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(RoleDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
