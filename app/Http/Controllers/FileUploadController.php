<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\FileUploadProcessRequest;
use Symfony\Component\HttpFoundation\Response;

final class FileUploadController
{
    public function process(FileUploadProcessRequest $request): Response
    {
        return $request->respond();
    }
}
