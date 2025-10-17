<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Requests\Product\ProductCreateProcessRequest;
use App\Http\Requests\Product\ProductCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductCreateController
{
    public function view(ProductCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
