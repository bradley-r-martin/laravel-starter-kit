<?php

declare(strict_types=1);

namespace App\Http\Controllers\Snackware;

use App\Http\Requests\Snackware\SnackwareCloseProcessRequest;
use App\Http\Requests\Snackware\SnackwareCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareCloseController
{
    public function view(SnackwareCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SnackwareCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
