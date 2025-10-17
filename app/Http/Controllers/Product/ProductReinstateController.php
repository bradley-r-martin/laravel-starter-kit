<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Requests\Product\ProductReinstateProcessRequest;
use App\Http\Requests\Product\ProductReinstateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductReinstateController
{
    public function view(ProductReinstateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductReinstateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
