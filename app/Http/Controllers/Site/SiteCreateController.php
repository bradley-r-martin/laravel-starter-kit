<?php

declare(strict_types=1);

namespace App\Http\Controllers\Site;

use App\Http\Requests\Site\SiteCreateProcessRequest;
use App\Http\Requests\Site\SiteCreateViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteCreateController
{
    public function view(SiteCreateViewRequest $request): Response
    {
        return $request->respond();
    }

    public function process(SiteCreateProcessRequest $request): Response
    {
        return $request->respond();
    }
}
