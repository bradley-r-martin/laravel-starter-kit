<?php

declare(strict_types=1);

namespace App\Http\Controllers\ProductType;

use App\Http\Requests\ProductType\ProductTypeCreateProcessRequest;
use App\Http\Requests\ProductType\ProductTypeCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeCreateController
{
    public function view(ProductTypeCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductTypeCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
