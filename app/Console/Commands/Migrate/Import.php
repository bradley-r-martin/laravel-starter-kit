<?php

declare(strict_types=1);

namespace App\Console\Commands\Migrate;

use App\Models\Expense;
use App\Models\ExpenseItem;
use App\Models\Manufacturer;
use App\Models\Operator;
use App\Models\Product;
use App\Models\ProductType;
use App\Models\Role;
use App\Models\Route;
use App\Models\Site;
use App\Models\Snackware;
use App\Models\Territory;
use App\Models\User;
use App\Models\Wholesaler;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\progress;

final class Import extends Command
{
    public Collection $data;

    protected $signature = 'migrate:import';

    protected $description = 'Import normalised JSON data into the database';

    private array $order = [
        'operators',
        'territories',
        'roles',
        'users',
        'product_types',
        'manufacturers',
        'wholesalers',
        'products',
        'snackware',
        'snackware_products',
        'expenses',
        'expense_items',
        'routes',
        'sites',
    ];

    public function handle(): void
    {
        $this->load();
        $this->invoke();
        $this->info('Import completed successfully!');
    }

    private function load(): void
    {
        $disk = Storage::disk('public');

        $this->data = collect(
            collect($disk->allFiles('migrate/enriched'))
                ->map(fn (string $file): string => basename($file, '.json'))
                ->mapWithKeys(function (string $table) use ($disk): array {
                    $items = collect(json_decode((string) $disk->get("migrate/enriched/{$table}.json"), true));

                    return [$table => $table !== 'snackware_products' ? $items->keyBy('id') : $items];
                })
        );
    }

    private function invoke(): void
    {
        collect($this->order)
            ->sortBy(fn (string $table): int|string|false => array_search($table, $this->order))
            ->each(function (string $table, mixed $key): void {
                if (method_exists($this, $table)) {
                    $this->{$table}();
                }
            });
    }

    private function expense_items(): void
    {
        progress(
            label: 'Importing expense items',
            steps: $this->data->get('expense_items'),
            callback: function (array $expenseItem, mixed $progress): void {
                $progress->hint("Importing expense item {$expenseItem['id']}...");
                ExpenseItem::updateOrCreate(
                    ['id' => $expenseItem['id']],
                    $expenseItem
                );
            }
        );
    }

    private function expenses(): void
    {
        progress(
            label: 'Importing expenses',
            steps: $this->data->get('expenses'),
            callback: function (array $expense, mixed $progress): void {
                $progress->hint("Importing expense {$expense['invoice_no']}...");
                Expense::updateOrCreate(
                    ['id' => $expense['id']],
                    $expense
                );
            }
        );
    }

    private function routes(): void
    {
        progress(
            label: 'Importing routes',
            steps: $this->data->get('routes'),
            callback: function (array $route, mixed $progress): void {
                $progress->hint("Importing route {$route['name']}...");
                Route::updateOrCreate(
                    ['id' => $route['id']],
                    $route
                );
            },
        );
    }

    private function snackware_products(): void
    {
        progress(
            label: 'Importing snackware products',
            steps: $this->data->get('snackware_products'),
            callback: function (array $snackware_product, mixed $progress): void {
                $progress->hint("Importing snackware product {$snackware_product['snackware_id']}...");
                DB::table('product_snackware')->updateOrInsert(
                    [
                        'snackware_id' => $snackware_product['snackware_id'],
                        'product_id' => $snackware_product['product_id'],
                    ],
                    $snackware_product
                );
            }
        );
    }

    private function snackware(): void
    {
        progress(
            label: 'Importing snackware',
            steps: $this->data->get('snackware'),
            callback: function (array $snackware, mixed $progress): void {
                $progress->hint("Importing snackware {$snackware['name']}...");
                Snackware::updateOrCreate(
                    ['id' => $snackware['id']],
                    $snackware
                );
            }
        );
    }

    private function products(): void
    {
        progress(
            label: 'Importing products',
            steps: $this->data->get('products'),
            callback: function (array $product, mixed $progress): void {
                $name = (string) ($product['name'] ?? '');
                $progress->hint("Importing product {$name}...");
                Product::updateOrCreate(
                    ['id' => $product['id']],
                    $product
                );
            }
        );
    }

    private function sites(): void
    {
        progress(
            label: 'Importing sites',
            steps: $this->data->get('sites'),
            callback: function (array $site, mixed $progress): void {
                $progress->hint("Importing site {$site['name']}...");
                if (! array_key_exists('order', $site) || $site['order'] === null) {
                    $site['order'] = 0;
                }
                Site::updateOrCreate(
                    ['id' => $site['id']],
                    $site,
                );
            },
        );
    }

    private function wholesalers(): void
    {
        progress(
            label: 'Importing wholesalers',
            steps: $this->data->get('wholesalers'),
            callback: function (array $wholesaler, mixed $progress): void {
                $name = (string) ($wholesaler['name'] ?? '');
                $progress->hint("Importing wholesaler {$name}...");
                Wholesaler::updateOrCreate(
                    ['id' => $wholesaler['id']],
                    $wholesaler
                );
            }
        );
    }

    private function manufacturers(): void
    {
        progress(
            label: 'Importing manufacturers',
            steps: $this->data->get('manufacturers'),
            callback: function (array $manufacturer, mixed $progress): void {
                $progress->hint("Importing manufacturer {$manufacturer['name']}...");
                Manufacturer::updateOrCreate(
                    ['id' => $manufacturer['id']],
                    $manufacturer,
                );
            },
        );
    }

    private function product_types(): void
    {
        progress(
            label: 'Importing product types',
            steps: $this->data->get('product_types'),
            callback: function (array $product_type, mixed $progress): void {
                $progress->hint("Importing product type {$product_type['name']}...");
                ProductType::updateOrCreate(
                    ['id' => $product_type['id']],
                    $product_type,
                );
            },
        );
    }

    private function users(): void
    {
        progress(
            label: 'Importing users',
            steps: $this->data->get('users'),
            callback: function (array $user, mixed $progress): void {
                $progress->hint("Importing user {$user['first_name']} {$user['last_name']}...");
                User::updateOrCreate(
                    ['id' => $user['id']],
                    $user,
                );
            },
        );
    }

    private function roles(): void
    {
        progress(
            label: 'Importing roles',
            steps: $this->data->get('roles'),
            callback: function (array $role, mixed $progress): void {
                $progress->hint("Importing role {$role['name']}...");
                Role::updateOrCreate(
                    ['id' => $role['id']],
                    $role
                );
            }
        );
    }

    private function territories(): void
    {
        progress(
            label: 'Importing territories',
            steps: $this->data->get('territories'),
            callback: function (array $territory, mixed $progress): void {
                $progress->hint("Importing territory {$territory['name']}...");
                Territory::updateOrCreate(
                    ['id' => $territory['id']],
                    $territory,
                );
            },
        );
    }

    private function operators(): void
    {
        progress(
            label: 'Importing operators',
            steps: $this->data->get('operators'),
            callback: function (array $operator, mixed $progress): void {
                $progress->hint("Importing operator {$operator['name']}...");
                Operator::updateOrCreate(
                    ['id' => $operator['id']],
                    $operator,
                );
            },
        );
    }
}
