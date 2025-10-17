<?php

declare(strict_types=1);

namespace App\Http\Controllers\ProductType;

use App\Http\Requests\ProductType\ProductTypeUpdateProcessRequest;
use App\Http\Requests\ProductType\ProductTypeUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeUpdateController
{
    public function view(ProductTypeUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductTypeUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
