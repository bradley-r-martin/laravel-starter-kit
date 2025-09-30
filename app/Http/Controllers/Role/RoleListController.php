<?php

declare(strict_types=1);

namespace App\Http\Controllers\Role;

use App\Http\Requests\Role\RoleListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleListController
{
    public function view(RoleListViewRequest $request): Response
    {
        return $request->respond();
    }
}
