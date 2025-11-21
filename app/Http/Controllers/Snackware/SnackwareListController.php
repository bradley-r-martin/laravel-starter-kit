<?php

declare(strict_types=1);

namespace App\Http\Controllers\Snackware;

use App\Http\Requests\Snackware\SnackwareListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareListController
{
    public function view(SnackwareListViewRequest $request): Response
    {
        return $request->respond();
    }
}

