<?php

declare(strict_types=1);

namespace Tests;

use App\Models\Territory;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    //

    final public function as(User $user, ?Territory $territory = null)
    {

        if ($territory) {
            return $this->actingAs($user)->withSession([
                'selected_territory' => $territory->id,
            ]);
        }

        return $this->actingAs($user);

    }
}
