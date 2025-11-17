<?php

declare(strict_types=1);

namespace App\Http\Controllers\Snackware;

use App\Http\Requests\Snackware\SnackwareDestroyProcessRequest;
use App\Http\Requests\Snackware\SnackwareDestroyViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareDestroyController
{
    public function view(SnackwareDestroyViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SnackwareDestroyProcessRequest $request): Response
    {
        return $request->respond();
    }
}
