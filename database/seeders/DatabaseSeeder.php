<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Actions\OperatorActions;
use App\Actions\ProductTypeActions;
use App\Actions\TerritoryActions;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $operator = OperatorActions::create([
            'name' => 'Test Operator',
            'email' => 'operator@example.com',
        ]);

        TerritoryActions::create([
            'operator_id' => $operator->id,
            'name' => 'Test Territory',
        ]);

        ProductTypeActions::create([
            'name' => 'Test Product Type',
            'description' => 'Test Product Type Description',
        ]);

        User::create([
            'operator_id' => $operator->id,
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);
    }
}
