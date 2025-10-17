<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Requests\Product\ProductUpdateProcessRequest;
use App\Http\Requests\Product\ProductUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductUpdateController
{
    public function view(ProductUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
