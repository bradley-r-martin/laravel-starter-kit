<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserSuspendProcessRequest;
use App\Http\Requests\User\UserSuspendViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserSuspendController
{
    public function view(UserSuspendViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(UserSuspendProcessRequest $request): Response
    {
        return $request->respond();
    }
}
