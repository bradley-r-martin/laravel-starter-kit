<?php

declare(strict_types=1);

namespace App\Http\Controllers\PushSubscription;

use App\Http\Requests\PushSubscription\CheckPushSubscriptionRequest;
use Symfony\Component\HttpFoundation\Response;

final class PushSubscriptionCheckController
{
    public function process(CheckPushSubscriptionRequest $request): Response
    {
        return $request->respond();
    }
}
