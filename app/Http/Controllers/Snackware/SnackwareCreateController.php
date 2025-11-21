<?php

declare(strict_types=1);

namespace App\Http\Controllers\Snackware;

use App\Http\Requests\Snackware\SnackwareCreateProcessRequest;
use App\Http\Requests\Snackware\SnackwareCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareCreateController
{
    public function view(SnackwareCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SnackwareCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}

