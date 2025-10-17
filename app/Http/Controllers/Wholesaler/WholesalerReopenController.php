<?php

declare(strict_types=1);

namespace App\Http\Controllers\Wholesaler;

use App\Http\Requests\Wholesaler\WholesalerReopenProcessRequest;
use App\Http\Requests\Wholesaler\WholesalerReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerReopenController
{
    public function view(WholesalerReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(WholesalerReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
