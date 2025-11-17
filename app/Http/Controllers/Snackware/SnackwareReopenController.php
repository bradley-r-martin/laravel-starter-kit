<?php

declare(strict_types=1);

namespace App\Http\Controllers\Snackware;

use App\Http\Requests\Snackware\SnackwareReopenProcessRequest;
use App\Http\Requests\Snackware\SnackwareReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareReopenController
{
    public function view(SnackwareReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SnackwareReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
