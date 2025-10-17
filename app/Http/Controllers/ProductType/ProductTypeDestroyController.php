<?php

declare(strict_types=1);

namespace App\Http\Controllers\ProductType;

use App\Http\Requests\ProductType\ProductTypeDestroyProcessRequest;
use App\Http\Requests\ProductType\ProductTypeDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeDestroyController
{
    public function view(ProductTypeDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductTypeDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
