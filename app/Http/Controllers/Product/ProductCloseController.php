<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Requests\Product\ProductCloseProcessRequest;
use App\Http\Requests\Product\ProductCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductCloseController
{
    public function view(ProductCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
