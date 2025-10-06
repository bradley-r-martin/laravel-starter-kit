<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserUnsuspendProcessRequest;
use App\Http\Requests\User\UserUnsuspendViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserUnsuspendController
{
    public function view(UserUnsuspendViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(UserUnsuspendProcessRequest $request): Response
    {
        return $request->respond();
    }
}
