<?php

declare(strict_types=1);

namespace App\Http\Controllers\ProductType;

use App\Http\Requests\ProductType\ProductTypeReopenProcessRequest;
use App\Http\Requests\ProductType\ProductTypeReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeReopenController
{
    public function view(ProductTypeReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductTypeReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
