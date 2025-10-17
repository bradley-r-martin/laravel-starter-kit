<?php

declare(strict_types=1);

namespace App\Http\Controllers\ProductType;

use App\Http\Requests\ProductType\ProductTypeListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeListController
{
    public function view(ProductTypeListViewRequest $request): Response
    {
        return $request->respond();
    }
}
