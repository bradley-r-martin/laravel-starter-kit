<?php

declare(strict_types=1);

namespace App\Http\Controllers\PushSubscription;

use App\Http\Requests\PushSubscription\CreatePushSubscriptionRequest;
use Symfony\Component\HttpFoundation\Response;

final class PushSubscriptionCreateController
{
    public function process(CreatePushSubscriptionRequest $request): Response
    {
        return $request->respond();
    }
}
