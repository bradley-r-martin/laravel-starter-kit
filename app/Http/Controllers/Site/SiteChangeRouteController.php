<?php

declare(strict_types=1);

namespace App\Http\Controllers\Site;

use App\Http\Requests\Site\SiteChangeRouteProcessRequest;
use App\Http\Requests\Site\SiteChangeRouteViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteChangeRouteController
{
    public function view(SiteChangeRouteViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SiteChangeRouteProcessRequest $request): Response
    {
        return $request->respond();
    }
}
