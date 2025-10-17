<?php

declare(strict_types=1);

namespace App\Http\Controllers\Wholesaler;

use App\Http\Requests\Wholesaler\WholesalerDestroyProcessRequest;
use App\Http\Requests\Wholesaler\WholesalerDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerDestroyController
{
    public function view(WholesalerDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(WholesalerDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
