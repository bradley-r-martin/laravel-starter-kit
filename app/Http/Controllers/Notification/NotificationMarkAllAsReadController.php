<?php

declare(strict_types=1);

namespace App\Http\Controllers\Notification;

use App\Http\Requests\Notification\NotificationMarkAllAsReadProcessRequest;
use Symfony\Component\HttpFoundation\Response;

final class NotificationMarkAllAsReadController
{
    public function process(NotificationMarkAllAsReadProcessRequest $request): Response
    {
        return $request->respond();
    }
}
