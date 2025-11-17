<?php

declare(strict_types=1);

namespace App\Http\Controllers\Site;

use App\Http\Requests\Site\SiteDetailViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteDetailController
{
    public function view(SiteDetailViewRequest $request): Response
    {
        return $request->respond();
    }
}

