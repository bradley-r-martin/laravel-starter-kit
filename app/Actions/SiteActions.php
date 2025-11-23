<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Site;

final class SiteActions
{
    public Site $site;

    public function __construct(
        Site|string $site,
    ) {
        if (is_string($site)) {
            /** @var Site $site */
            $site = Site::findOrFail($site);
        }
        $this->site = $site;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Site
    {
        return Site::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Site
    {
        $this->site->update($data);

        return $this->site;
    }

    public function close(): Site
    {
        $this->site->update([
            'closed_at' => now(),
        ]);

        return $this->site;
    }

    public function reopen(): Site
    {
        $this->site->update([
            'closed_at' => null,
        ]);

        return $this->site;
    }

    public function refreshManagerCode(): Site
    {
        $managerCode = mb_str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        $this->site->update([
            'manager_code' => $managerCode,
        ]);

        return $this->site;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function changeRoute(array $data): Site
    {
        $this->site->update($data);

        return $this->site;
    }
}
