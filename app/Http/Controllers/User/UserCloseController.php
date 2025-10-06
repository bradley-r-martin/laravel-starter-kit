<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserCloseProcessRequest;
use App\Http\Requests\User\UserCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserCloseController
{
    public function view(UserCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(UserCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
