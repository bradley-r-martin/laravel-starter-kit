<?php

declare(strict_types=1);

namespace App\Http\Controllers\Site;

use App\Http\Requests\Site\SiteRefreshManagerCodeProcessRequest;
use App\Http\Requests\Site\SiteRefreshManagerCodeViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteRefreshManagerCodeController
{
    public function view(SiteRefreshManagerCodeViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SiteRefreshManagerCodeProcessRequest $request): Response
    {
        return $request->respond();
    }
}
