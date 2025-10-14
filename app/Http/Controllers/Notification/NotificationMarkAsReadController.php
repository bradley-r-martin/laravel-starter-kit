<?php

declare(strict_types=1);

namespace App\Http\Controllers\Notification;

use App\Http\Requests\Notification\NotificationMarkAsReadProcessRequest;
use Symfony\Component\HttpFoundation\Response;

final class NotificationMarkAsReadController
{
    public function process(NotificationMarkAsReadProcessRequest $request): Response
    {
        return $request->respond();
    }
}
