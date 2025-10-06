<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserDestroyProcessRequest;
use App\Http\Requests\User\UserDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserDestroyController
{
    public function view(UserDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(UserDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
