<?php

declare(strict_types=1);

namespace App\Http\Controllers\Wholesaler;

use App\Http\Requests\Wholesaler\WholesalerCreateProcessRequest;
use App\Http\Requests\Wholesaler\WholesalerCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerCreateController
{
    public function view(WholesalerCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(WholesalerCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
