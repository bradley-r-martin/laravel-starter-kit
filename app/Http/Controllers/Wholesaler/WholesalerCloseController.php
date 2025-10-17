<?php

declare(strict_types=1);

namespace App\Http\Controllers\Wholesaler;

use App\Http\Requests\Wholesaler\WholesalerCloseProcessRequest;
use App\Http\Requests\Wholesaler\WholesalerCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerCloseController
{
    public function view(WholesalerCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(WholesalerCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
