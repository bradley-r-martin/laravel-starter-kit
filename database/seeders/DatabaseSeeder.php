<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Actions\ManufacturerActions;
use App\Actions\OperatorActions;
use App\Actions\ProductActions;
use App\Actions\ProductTypeActions;
use App\Actions\RoleActions;
use App\Actions\TerritoryActions;
use App\Actions\UserActions;
use App\Actions\WholesalerActions;
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

        $productType = ProductTypeActions::create([
            'name' => 'Test Product Type',
        ]);

        $manufacturer = ManufacturerActions::create([
            'name' => 'Test Manufacturer',
        ]);

        WholesalerActions::create([
            'name' => 'Test Wholesaler',
        ]);

        ProductActions::create([
            'product_type_id' => $productType->id,
            'manufacturer_id' => $manufacturer->id,
            'name' => 'Test Product',
            'sku' => 'TEST-001',
            'units' => 12,
            'cost' => 100,
            'price' => 200,
        ]);

        $role = RoleActions::create([
            'name' => 'Test Role',
        ]);

        UserActions::create([
            'operator_id' => $operator->id,
            'role_id' => $role->id,
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);
    }
}
