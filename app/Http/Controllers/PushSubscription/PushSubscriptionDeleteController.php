<?php

declare(strict_types=1);

namespace App\Http\Controllers\PushSubscription;

use App\Http\Requests\PushSubscription\DeletePushSubscriptionRequest;
use Symfony\Component\HttpFoundation\Response;

final class PushSubscriptionDeleteController
{
    public function process(DeletePushSubscriptionRequest $request): Response
    {
        return $request->respond();
    }
}
