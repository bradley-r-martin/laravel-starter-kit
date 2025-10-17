<?php

declare(strict_types=1);

namespace App\Http\Controllers\ProductType;

use App\Http\Requests\ProductType\ProductTypeCloseProcessRequest;
use App\Http\Requests\ProductType\ProductTypeCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeCloseController
{
    public function view(ProductTypeCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(ProductTypeCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
