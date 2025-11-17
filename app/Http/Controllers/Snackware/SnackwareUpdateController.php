<?php

declare(strict_types=1);

namespace App\Http\Controllers\Snackware;

use App\Http\Requests\Snackware\SnackwareUpdateProcessRequest;
use App\Http\Requests\Snackware\SnackwareUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareUpdateController
{
    public function view(SnackwareUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SnackwareUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
