<?php

declare(strict_types=1);

namespace App\Http\Controllers\Notification;

use App\Http\Requests\Notification\NotificationListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class NotificationListController
{
    public function view(NotificationListViewRequest $request): Response
    {
        return $request->respond();
    }
}
