<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Requests\Product\ProductListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductListController
{
    public function view(ProductListViewRequest $request): Response
    {
        return $request->respond();
    }
}
