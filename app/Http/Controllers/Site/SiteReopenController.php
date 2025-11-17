<?php

declare(strict_types=1);

namespace App\Http\Controllers\Site;

use App\Http\Requests\Site\SiteReopenProcessRequest;
use App\Http\Requests\Site\SiteReopenViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteReopenController
{
    public function view(SiteReopenViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SiteReopenProcessRequest $request): Response
    {
        return $request->respond();
    }
}
