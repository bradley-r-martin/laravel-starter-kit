<?php

declare(strict_types=1);

namespace App\Console\Commands\Migrate;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Fluent;

use function Laravel\Prompts\progress;

final class Normalise extends Command
{
    public Collection $data;

    public Fluent $normalised;

    protected $signature = 'migrate:normalise';

    protected $description = 'Normalise the data';

    public function handle(): void
    {
        $this->load();
        $this->invoke();
    }

    private function load(): void
    {
        $disk = Storage::disk('public');

        $this->data = collect(
            collect($disk->allFiles('migrate/downloaded'))
                ->map(fn (string $file): string => basename($file, '.json'))
                ->mapWithKeys(function (string $table) use ($disk): array {
                    $items = collect(json_decode((string) $disk->get("migrate/downloaded/{$table}.json"), true));

                    return [$table => $table !== 'snackware_products' ? $items->keyBy('id') : $items];
                })
        );

        $this->normalised = fluent(
            $this->data->keys()->mapWithKeys(fn (string $table): array => [$table => collect()])
        );
    }

    private function invoke(): void
    {
        $this->data->keys()->each(function (string $table): void {
            if (method_exists($this, $table)) {
                $this->{$table}();
                Storage::disk('public')->put(
                    "migrate/normalised/{$table}.json",
                    $this->normalised->{$table}->toJson(JSON_PRETTY_PRINT)
                );
            }
        });
    }

    private function operators(): void
    {
        progress(
            label: 'Normalising operators',
            steps: $this->data->get('operators'),
            callback: function (array $operator, mixed $progress): void {
                $progress->hint("Normalising operator {$operator['name']}...");
                $this->normalised->operators->push(fluent([
                    'id' => mb_strtoupper((string) $operator['id']),
                    'name' => $operator['name'],
                    'email' => $operator['email'],
                    'phone' => $operator['phone'] ? json_decode((string) $operator['phone']) : null,
                    'address' => $operator['address'] ? json_decode((string) $operator['address']) : null,
                    'closed_at' => $operator['status'] === 'closed' ? $operator['updated_at'] : null,
                    'created_at' => $operator['created_at'],
                    'updated_at' => $operator['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/operators.json',
            $this->normalised->operators->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function territories(): void
    {
        progress(
            label: 'Normalising territories',
            steps: $this->data->get('territories'),
            callback: function (array $territory, mixed $progress): void {
                $progress->hint("Normalising territory {$territory['name']}...");
                $this->normalised->territories->push(fluent([
                    'id' => mb_strtoupper((string) $territory['id']),
                    'name' => $territory['name'],
                    'operator_id' => mb_strtoupper((string) $territory['operator_id']),
                    'closed_at' => $territory['status'] === 'suspended' ? $territory['updated_at'] : null,
                    'created_at' => $territory['created_at'],
                    'updated_at' => $territory['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/territories.json',
            $this->normalised->territories->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function roles(): void
    {
        progress(
            label: 'Normalising roles',
            steps: $this->data->get('roles'),
            callback: function (array $role, mixed $progress): void {
                $progress->hint("Normalising role {$role['name']}...");
                $this->normalised->roles->push(fluent([
                    'id' => mb_strtoupper((string) $role['id']),
                    'name' => $role['name'],
                    'description' => $role['description'],
                    'closed_at' => $role['status'] === 'closed' ? $role['updated_at'] : null,
                    'created_at' => $role['created_at'],
                    'updated_at' => $role['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/roles.json',
            $this->normalised->roles->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function users(): void
    {
        progress(
            label: 'Normalising users',
            steps: $this->data->get('users'),
            callback: function (array $user, mixed $progress): void {
                $progress->hint("Normalising user {$user['first_name']} {$user['last_name']}...");
                $this->normalised->users->push(fluent([
                    'id' => mb_strtoupper((string) $user['id']),
                    'operator_id' => mb_strtoupper((string) $user['operator_id']),
                    'role_id' => mb_strtoupper((string) $user['role_id']),
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'email' => $user['email'],
                    'email_verified_at' => $user['created_at'],
                    'password' => $user['password'],
                    'remember_token' => $user['remember_token'],
                    'closed_at' => $user['status'] === 'closed' ? $user['updated_at'] : null,
                    'created_at' => $user['created_at'],
                    'updated_at' => $user['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/users.json',
            $this->normalised->users->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function product_types(): void
    {
        progress(
            label: 'Normalising product types',
            steps: $this->data->get('product_types'),
            callback: function (array $product_type, mixed $progress): void {
                $progress->hint("Normalising product type {$product_type['name']}...");
                $this->normalised->product_types->push(fluent([
                    'id' => mb_strtoupper((string) $product_type['id']),
                    'name' => $product_type['name'],
                    'short_name' => $product_type['short_name'],
                    'closed_at' => $product_type['status'] === 'closed' ? $product_type['updated_at'] : null,
                    'created_at' => $product_type['created_at'],
                    'updated_at' => $product_type['updated_at'],
                ]));
            }
        );
        // Add an unspecified product type.
        $this->normalised->product_types->push(fluent([
            'id' => '01K1F5HGTW2B4N29ZK2P31KK0Z',
            'name' => 'Unspecified',
            'short_name' => 'Unspecified',
            'closed_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]));
        Storage::disk('public')->put(
            'migrate/normalised/product_types.json',
            $this->normalised->product_types->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function manufacturers(): void
    {
        progress(
            label: 'Normalising manufacturers',
            steps: $this->data->get('manufacturers'),
            callback: function (array $manufacturer, mixed $progress): void {
                $progress->hint("Normalising manufacturer {$manufacturer['name']}...");
                $this->normalised->manufacturers->push(fluent([
                    'id' => mb_strtoupper((string) $manufacturer['id']),
                    'name' => $manufacturer['name'],
                    'closed_at' => $manufacturer['status'] === 'closed' ? $manufacturer['updated_at'] : null,
                    'created_at' => $manufacturer['created_at'],
                    'updated_at' => $manufacturer['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/manufacturers.json',
            $this->normalised->manufacturers->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function wholesalers(): void
    {
        progress(
            label: 'Normalising wholesalers',
            steps: $this->data->get('wholesalers'),
            callback: function (array $wholesaler, mixed $progress): void {
                $progress->hint("Normalising wholesaler {$wholesaler['name']}...");
                $this->normalised->wholesalers->push(fluent([
                    'id' => mb_strtoupper((string) $wholesaler['id']),
                    'name' => $wholesaler['name'],
                    'closed_at' => $wholesaler['status'] === 'closed' ? $wholesaler['updated_at'] : null,
                    'created_at' => $wholesaler['created_at'],
                    'updated_at' => $wholesaler['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/wholesalers.json',
            $this->normalised->wholesalers->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function products(): void
    {
        progress(
            label: 'Normalising products',
            steps: $this->data->get('products'),
            callback: function (array $product, mixed $progress): void {
                $progress->hint("Normalising product {$product['name']}...");
                $this->normalised->products->push(fluent([
                    'id' => mb_strtoupper((string) $product['id']),
                    'manufacturer_id' => mb_strtoupper((string) $product['manufacturer_id']),
                    'product_type_id' => mb_strtoupper((string) $product['product_type_id']),
                    'name' => $product['name'],
                    'sku' => $product['sku'],
                    'units' => $product['units'],
                    'price' => $product['retail_price'],
                    'cost' => $product['wholesale_cost'],
                    'rebate' => $product['rebate'],
                    'royalty' => $product['royalty'],
                    'closed_at' => $product['status'] === 'closed' ? $product['updated_at'] : null,
                    'created_at' => $product['created_at'],
                    'updated_at' => $product['updated_at'],
                ]));
            }
        );
        // Add an unspecified product so that all snackwares have an associated product
        $this->normalised->products->push(fluent([
            'id' => '01K1F5J88D0J9DZK63T1AMNH52',
            'manufacturer_id' => '01J0NV0YQBRD1DK70RMRVXTKKV',
            'product_type_id' => '01K1F5HGTW2B4N29ZK2P31KK0Z',
            'name' => 'Unspecified',
            'sku' => 'Unspecified',
            'units' => 0,
            'price' => 0,
            'cost' => 0,
            'rebate' => 0,
            'royalty' => 1,
            'closed_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]));
        Storage::disk('public')->put(
            'migrate/normalised/products.json',
            $this->normalised->products->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function snackware(): void
    {
        progress(
            label: 'Normalising snackware',
            steps: $this->data->get('snackware'),
            callback: function (array $snackware, mixed $progress): void {
                $progress->hint("Normalising snackware {$snackware['name']}...");
                $territory = $this->data->get('territories')->get(mb_strtoupper((string) $snackware['territory_id']));
                if (! $territory) {
                    dd('no territory found');
                }
                $this->normalised->snackware->push(fluent([
                    'id' => mb_strtoupper((string) $snackware['id']),
                    'territory_id' => mb_strtoupper((string) $snackware['territory_id']),
                    'operator_id' => mb_strtoupper((string) $territory['operator_id']),
                    'name' => $snackware['name'],
                    'type' => $snackware['type'],
                    'price' => $snackware['legacy_price'],
                    'closed_at' => $snackware['status'] === 'closed' ? $snackware['updated_at'] : null,
                    'created_at' => $snackware['created_at'],
                    'updated_at' => $snackware['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/snackware.json',
            $this->normalised->snackware->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function snackware_products(): void
    {
        progress(
            label: 'Normalising snackware products',
            steps: $this->data->get('snackware_products'),
            callback: function (array $snackware_product, mixed $progress): void {
                $progress->hint("Normalising snackware product {$snackware_product['snackware_id']}...");
                $this->normalised->snackware_products->push(fluent([
                    'snackware_id' => mb_strtoupper((string) $snackware_product['snackware_id']),
                    'product_id' => mb_strtoupper((string) $snackware_product['product_id']),
                ]));
            }
        );
        // Add an unspecified product to all snackwares that have no products.
        $this->data->get('snackware')
            ->whereNotIn('id', $this->data->get('snackware_products')->pluck('snackware_id'))
            ->each(function (array $snackware, mixed $key): void {
                $this->normalised->snackware_products->push(fluent([
                    'snackware_id' => mb_strtoupper((string) $snackware['id']),
                    'product_id' => '01K1F5J88D0J9DZK63T1AMNH52',
                ]));
            });
        Storage::disk('public')->put(
            'migrate/normalised/snackware_products.json',
            $this->normalised->snackware_products->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function sites(): void
    {
        progress(
            label: 'Normalising sites',
            steps: $this->data->get('sites'),
            callback: function (array $site, mixed $progress): void {
                $progress->hint("Normalising site {$site['name']}...");
                $territory = $this->data->get('territories')->get(mb_strtoupper((string) $site['territory_id']));
                if (! $territory) {
                    dd('no territory found');
                }
                $this->normalised->sites->push(fluent([
                    'id' => mb_strtoupper((string) $site['id']),
                    'territory_id' => mb_strtoupper((string) $site['territory_id']),
                    'operator_id' => mb_strtoupper((string) $territory['operator_id']),
                    'route_id' => $site['run_id'] ? mb_strtoupper((string) $site['run_id']) : null,
                    'name' => $site['name'],
                    'address' => $site['address'] ? array_merge((array) json_decode((string) $site['address']), [
                        'latitude' => $site['latitude'],
                        'longitude' => $site['longitude'],
                    ]) : null,
                    'opening_hours' => $site['opening_hours'] ? json_decode((string) $site['opening_hours']) : null,
                    'order' => $site['order'],
                    'manager_code' => $site['manager_code'] ?? mb_str_pad(''.random_int(0, 9999), 4, '0', STR_PAD_LEFT),
                    'closed_at' => $site['status'] === 'closed' ? $site['updated_at'] : null,
                    'created_at' => $site['created_at'],
                    'updated_at' => $site['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/sites.json',
            $this->normalised->sites->toJson(JSON_PRETTY_PRINT)
        );
    }

    // Runs table from legacy system is now routes table
    private function runs(): void
    {
        progress(
            label: 'Normalising routes',
            steps: $this->data->get('runs'), // Runs table from legacy system is now routes table
            callback: function (array $route, mixed $progress): void {
                $progress->hint("Normalising route {$route['name']}...");
                $territory = $this->data->get('territories')->get(mb_strtoupper((string) $route['territory_id']));
                if (! $territory) {
                    dd('no territory found');
                }
                $this->normalised->runs->push(fluent([
                    'id' => mb_strtoupper((string) $route['id']),
                    'name' => $route['name'],
                    'territory_id' => mb_strtoupper((string) $route['territory_id']),
                    'operator_id' => mb_strtoupper((string) $territory['operator_id']),
                    'schedule' => $route['schedule'] ? json_decode((string) $route['schedule']) : null,
                    'closed_at' => $route['status'] === 'closed' ? $route['updated_at'] : null,
                    'created_at' => $route['created_at'],
                    'updated_at' => $route['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/routes.json',
            $this->normalised->runs->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function expenses(): void
    {
        progress(
            label: 'Normalising expenses',
            steps: $this->data->get('expenses'),
            callback: function (array $expense, mixed $progress): void {
                $progress->hint("Normalising expense {$expense['id']}...");
                $this->normalised->expenses->push(fluent([
                    'id' => mb_strtoupper((string) $expense['id']),
                    'wholesaler_id' => mb_strtoupper((string) $expense['wholesaler_id']),
                    'operator_id' => mb_strtoupper((string) $expense['operator_id']),
                    'invoice_no' => $expense['invoice_no'],
                    'invoice_date' => Carbon::parse($expense['invoice_date'])->startOfDay(),
                    'completed_at' => $expense['status'] === 'complete' ? $expense['updated_at'] : null,
                    'created_at' => $expense['created_at'],
                    'updated_at' => $expense['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/expenses.json',
            $this->normalised->expenses->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function expense_items(): void
    {
        progress(
            label: 'Normalising expense items',
            steps: $this->data->get('expense_items'),
            callback: function (array $expense_item, mixed $progress): void {
                $progress->hint("Normalising expense item {$expense_item['name']}...");
                $product = $this->data->get('products')->get(mb_strtoupper((string) $expense_item['product_id']));
                $this->normalised->expense_items->push(fluent([
                    'id' => mb_strtoupper((string) $expense_item['id']),
                    'expense_id' => mb_strtoupper((string) $expense_item['expense_id']),
                    'product_id' => mb_strtoupper((string) $expense_item['product_id']),
                    'quantity' => $expense_item['units'],
                    'price' => $expense_item['wholesale_cost'],
                    'product_units' => $expense_item['product_units'],
                    'product_retail_price' => $expense_item['product_rrp'],
                    'product_royalty' => $expense_item['product_royalty'],
                    'product_rebate' => $expense_item['product_rebate'],
                    'data' => [
                        'name' => $expense_item['name'],
                        'sku' => $product['sku'],
                    ],
                    'completed_at' => $expense_item['status'] === 'complete' ? $expense_item['updated_at'] : null,
                    'created_at' => $expense_item['created_at'],
                    'updated_at' => $expense_item['updated_at'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/normalised/expense_items.json',
            $this->normalised->expense_items->toJson(JSON_PRETTY_PRINT)
        );
    }
}
