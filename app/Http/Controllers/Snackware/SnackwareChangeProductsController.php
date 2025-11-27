<?php

declare(strict_types=1);

namespace App\Http\Controllers\Snackware;

use App\Http\Requests\Snackware\SnackwareChangeProductsProcessRequest;
use App\Http\Requests\Snackware\SnackwareChangeProductsViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareChangeProductsController
{
    public function view(SnackwareChangeProductsViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SnackwareChangeProductsProcessRequest $request): Response
    {
        return $request->respond();
    }
}
