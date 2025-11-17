<?php

declare(strict_types=1);

namespace App\Http\Controllers\Site;

use App\Http\Requests\Site\SiteCloseProcessRequest;
use App\Http\Requests\Site\SiteCloseViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteCloseController
{
    public function view(SiteCloseViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SiteCloseProcessRequest $request): Response
    {
        return $request->respond();
    }
}
