<?php

declare(strict_types=1);

namespace App\Http\Controllers\Site;

use App\Http\Requests\Site\SiteUpdateProcessRequest;
use App\Http\Requests\Site\SiteUpdateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteUpdateController
{
    public function view(SiteUpdateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SiteUpdateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
