<?php

declare(strict_types=1);

namespace App\Http\Controllers\Site;

use App\Http\Requests\Site\SiteListViewRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteListController
{
    public function view(SiteListViewRequest $request): Response
    {
        return $request->respond();
    }
}

