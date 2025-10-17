<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Requests\Product\ProductDestroyProcessRequest;
use App\Http\Requests\Product\ProductDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductDestroyController
{
    public function view(ProductDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
