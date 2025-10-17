<?php

declare(strict_types=1);

namespace App\Http\Controllers\Wholesaler;

use App\Http\Requests\Wholesaler\WholesalerUpdateProcessRequest;
use App\Http\Requests\Wholesaler\WholesalerUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerUpdateController
{
    public function view(WholesalerUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(WholesalerUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
