<?php

declare(strict_types=1);

namespace App\Http\Controllers\Notification;

use App\Http\Requests\Notification\NotificationSendSampleProcessRequest;
use Symfony\Component\HttpFoundation\Response;

final class NotificationSendSampleController
{
    public function process(NotificationSendSampleProcessRequest $request): Response
    {
        return $request->respond();
    }
}
