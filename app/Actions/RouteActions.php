<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Route;

final class RouteActions
{
    public Route $route;

    public function __construct(
        Route|string $route,
    ) {
        if (is_string($route)) {
            /** @var Route $route */
            $route = Route::findOrFail($route);
        }
        $this->route = $route;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Route
    {
        return Route::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Route
    {
        $this->route->update($data);

        return $this->route;
    }
}
