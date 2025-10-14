<?php

declare(strict_types=1);

namespace App\Http\Controllers\Notification;

use App\Http\Requests\Notification\NotificationDeleteProcessRequest;
use Symfony\Component\HttpFoundation\Response;

final class NotificationDeleteController
{
    public function process(NotificationDeleteProcessRequest $request): Response
    {
        return $request->respond();
    }
}
