<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserListController
{
    public function view(UserListViewRequest $request): Response
    {
        return $request->respond();
    }
}
