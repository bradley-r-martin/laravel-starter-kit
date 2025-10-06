<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Requests\User\UserReopenProcessRequest;
use App\Http\Requests\User\UserReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserReopenController
{
    public function view(UserReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(UserReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
