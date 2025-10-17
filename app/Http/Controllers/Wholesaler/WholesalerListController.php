<?php

declare(strict_types=1);

namespace App\Http\Controllers\Wholesaler;

use App\Http\Requests\Wholesaler\WholesalerListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerListController
{
    public function view(WholesalerListViewRequest $request): Response
    {
        return $request->respond();
    }
}
