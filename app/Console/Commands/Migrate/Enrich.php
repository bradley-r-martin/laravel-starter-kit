<?php

declare(strict_types=1);

namespace App\Console\Commands\Migrate;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Fluent;

use function Laravel\Prompts\progress;

final class Enrich extends Command
{
    public Collection $data;

    public Fluent $enriched;

    protected $signature = 'migrate:enrich';

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
            collect($disk->allFiles('migrate/normalised'))
                ->map(fn (string $file): string => basename($file, '.json'))
                ->mapWithKeys(function (string $table) use ($disk): array {
                    $items = collect(json_decode((string) $disk->get("migrate/normalised/{$table}.json"), true));

                    return [$table => $table !== 'snackware_products' ? $items->keyBy('id') : $items];
                })
        );

        $this->enriched = fluent(
            $this->data->keys()->mapWithKeys(fn (string $table): array => [$table => collect()])
        );
    }

    private function invoke(): void
    {
        $this->data->keys()->each(function (string $table): void {
            if (method_exists($this, $table)) {
                $this->{$table}();
                Storage::disk('public')->put(
                    "migrate/enriched/{$table}.json",
                    $this->enriched->{$table}->toJson(JSON_PRETTY_PRINT)
                );
            }
        });
    }

    private function operators(): void
    {
        progress(
            label: 'Enriching operators',
            steps: $this->data->get('operators'),
            callback: function (array $operator, mixed $progress): void {
                $progress->hint("Enriching operator {$operator['name']}...");
                $this->enriched->operators->push(fluent([
                    ...$operator,
                    '__territories_count' => $this->data->get('territories')->where('operator_id', $operator['id'])->count(),
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/operators.json',
            $this->enriched->operators->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function territories(): void
    {
        progress(
            label: 'Enriching territories',
            steps: $this->data->get('territories'),
            callback: function (array $territory, mixed $progress): void {
                $progress->hint("Enriching territory {$territory['name']}...");
                $this->enriched->territories->push(fluent([
                    ...$territory,
                    '__operator_name' => $this->data->get('operators')->get($territory['operator_id'])['name'],
                    '__last_transaction_at' => null,
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/territories.json',
            $this->enriched->territories->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function roles(): void
    {
        progress(
            label: 'Enriching roles',
            steps: $this->data->get('roles'),
            callback: function (array $role, mixed $progress): void {
                $progress->hint("Enriching role {$role['name']}...");
                $this->enriched->roles->push(fluent([
                    ...$role,
                    '__users_count' => $this->data->get('users')->where('role_id', $role['id'])->count(),
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/roles.json',
            $this->enriched->roles->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function users(): void
    {
        progress(
            label: 'Enriching users',
            steps: $this->data->get('users'),
            callback: function (array $user, mixed $progress): void {
                $progress->hint("Enriching user {$user['first_name']} {$user['last_name']}...");
                $this->enriched->users->push(fluent([
                    ...$user,
                    '__operator_name' => $this->data->get('operators')->get($user['operator_id'])['name'],
                    '__role_name' => $this->data->get('roles')->get($user['role_id'])['name'],
                    '__last_login_at' => null,
                    '__last_login_ip' => null,
                    '__last_login_user_agent' => null,
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/users.json',
            $this->enriched->users->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function product_types(): void
    {
        progress(
            label: 'Enriching product types',
            steps: $this->data->get('product_types'),
            callback: function (array $product_type, mixed $progress): void {
                $progress->hint("Enriching product type {$product_type['name']}...");
                $this->enriched->product_types->push(fluent([
                    ...$product_type,
                    '__products_count' => $this->data->get('products')->where('product_type_id', $product_type['id'])->count(),
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/product_types.json',
            $this->enriched->product_types->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function manufacturers(): void
    {
        progress(
            label: 'Enriching manufacturers',
            steps: $this->data->get('manufacturers'),
            callback: function (array $manufacturer, mixed $progress): void {
                $progress->hint("Enriching manufacturer {$manufacturer['name']}...");
                $this->enriched->manufacturers->push(fluent([
                    ...$manufacturer,
                    '__products_count' => $this->data->get('products')->where('manufacturer_id', $manufacturer['id'])->count(),
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/manufacturers.json',
            $this->enriched->manufacturers->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function wholesalers(): void
    {
        progress(
            label: 'Enriching wholesalers',
            steps: $this->data->get('wholesalers'),
            callback: function (array $wholesaler, mixed $progress): void {
                $progress->hint("Enriching wholesaler {$wholesaler['name']}...");
                $this->enriched->wholesalers->push(fluent([
                    ...$wholesaler,
                    '__expenses_count' => $this->data->get('expenses')->where('wholesaler_id', $wholesaler['id'])->count(),
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/wholesalers.json',
            $this->enriched->wholesalers->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function products(): void
    {
        progress(
            label: 'Enriching products',
            steps: $this->data->get('products'),
            callback: function (array $product, mixed $progress): void {
                $progress->hint("Enriching product {$product['name']}...");
                $this->enriched->products->push(fluent([
                    ...$product,
                    '__manufacturer_name' => $this->data->get('manufacturers')->get($product['manufacturer_id'])['name'],
                    '__product_type_name' => $this->data->get('product_types')->get($product['product_type_id'])['name'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/products.json',
            $this->enriched->products->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function snackware(): void
    {
        progress(
            label: 'Enriching snackware',
            steps: $this->data->get('snackware'),
            callback: function (array $snackware, mixed $progress): void {
                $progress->hint("Enriching snackware {$snackware['name']}...");
                $this->enriched->snackware->push(fluent([
                    ...$snackware,
                    '__products_count' => $this->data->get('snackware_products')->where('snackware_id', $snackware['id'])->count(),
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/snackware.json',
            $this->enriched->snackware->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function snackware_products(): void
    {
        progress(
            label: 'Enriching snackware products',
            steps: $this->data->get('snackware_products'),
            callback: function (array $snackware_product, mixed $progress): void {
                $progress->hint("Enriching snackware product {$snackware_product['snackware_id']}...");
                $this->enriched->snackware_products->push(fluent([
                    ...$snackware_product,
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/snackware_products.json',
            $this->enriched->snackware_products->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function sites(): void
    {
        progress(
            label: 'Enriching sites',
            steps: $this->data->get('sites'),
            callback: function (array $site, mixed $progress): void {
                $progress->hint("Enriching site {$site['name']}...");
                $this->enriched->sites->push(fluent([
                    ...$site,
                    '__route_name' => null,
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/sites.json',
            $this->enriched->sites->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function routes(): void
    {
        progress(
            label: 'Enriching routes',
            steps: $this->data->get('routes'),
            callback: function (array $route, mixed $progress): void {
                $progress->hint("Enriching route {$route['name']}...");
                $this->enriched->routes->push(fluent([
                    ...$route,
                    '__sites_count' => $this->data->get('sites')->where('route_id', $route['id'])->count(),
                    '__next_run_at' => null,
                    '__last_run_at' => null,
                    '__last_run_id' => null,
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/routes.json',
            $this->enriched->routes->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function expenses(): void
    {
        progress(
            label: 'Enriching expenses',
            steps: $this->data->get('expenses'),
            callback: function (array $expense, mixed $progress): void {
                $progress->hint("Enriching expense {$expense['id']}...");
                $this->enriched->expenses->push(fluent([
                    ...$expense,
                    '__wholesaler_name' => $this->data->get('wholesalers')->get($expense['wholesaler_id'])['name'],
                    '__cost' => $this->data->get('expense_items')->where('expense_id', $expense['id'])->sum('price'),
                    '__rebate' => $this->data->get('expense_items')->where('expense_id', $expense['id'])->sum('product_rebate'),
                    '__royalty' => $this->data->get('expense_items')->where('expense_id', $expense['id'])->sum('product_royalty'),
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/expenses.json',
            $this->enriched->expenses->toJson(JSON_PRETTY_PRINT)
        );
    }

    private function expense_items(): void
    {
        progress(
            label: 'Enriching expense items',
            steps: $this->data->get('expense_items'),
            callback: function (array $expense_item, mixed $progress): void {
                $progress->hint("Enriching expense item {$expense_item['id']}...");
                $this->enriched->expense_items->push(fluent([
                    ...$expense_item,
                    '__product_name' => $this->data->get('products')->get($expense_item['product_id'])['name'],
                ]));
            }
        );
        Storage::disk('public')->put(
            'migrate/enriched/expense_items.json',
            $this->enriched->expense_items->toJson(JSON_PRETTY_PRINT)
        );
    }
}
