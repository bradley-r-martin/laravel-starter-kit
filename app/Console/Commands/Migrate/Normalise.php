<?php

declare(strict_types=1);

namespace App\Console\Commands\Migrate;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use SplFileInfo;

use function Laravel\Prompts\progress;

final class Normalise extends Command
{
    public \Illuminate\Support\Collection $tables;

    /**
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $operators
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $territories
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $users
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $roles
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $sites
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $placements
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $snackware
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $snackware_products
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $runs
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $products
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $product_types
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $manufacturers
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $wholesalers
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $transactions
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $resupplies
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $reconciliations
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $contacts
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $customers
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $q_r_codes
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $expenses
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $expense_items
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>> $placement_proportions
     */
    public \Illuminate\Support\Fluent $data;

    /**
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $operators
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $territories
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $users
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $sites
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $placements
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $snackware
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $snackware_products
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $runs
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $routes
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $products
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $product_types
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $manufacturers
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $wholesalers
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $transactions
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $resupplies
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $reconciliations
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $contacts
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $customers
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $q_r_codes
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $expenses
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $expense_items
     * @phpstan-property \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $placement_proportions
     */
    public \Illuminate\Support\Fluent $normalised;

    protected $signature = 'migrate:normalise';

    protected $description = 'Normalise the data';

    public function handle(): void
    {
        $this->load();
        $this->normalise();
    }

    public function load(): void
    {
        $this->tables = collect(File::allFiles(storage_path('app/migrate/downloaded')))->map(fn (SplFileInfo $file): string => $file->getFilenameWithoutExtension());
        $this->data = fluent([]);
        $this->normalised = fluent([]);
        $this->tables->each(function (string $table, mixed $key): void {
            $this->data->{$table} = collect(json_decode(File::get(storage_path('app/migrate/downloaded/'.$table.'.json')), true));
            if ($table !== 'snackware_products') {
                $this->data->{$table} = $this->data->{$table}->keyBy('id');
            }
            $this->normalised->{$table} = collect([]);
        });
    }

    public function normalise(): void
    {

        $this->tables->each(function (string $table, mixed $key): void {
            if (method_exists($this, $table)) {
                $this->{$table}();
                File::put(storage_path('app/migrate/normalised/'.$table.'.json'), $this->normalised->{$table}->toJson(JSON_PRETTY_PRINT));
            }
        });
    }

    public function operators(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $operators */
        $operators = $this->data->operators;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedOperators */
        $normalisedOperators = $this->normalised->operators;

        progress(
            label: 'Normalising operators',
            steps: $operators,
            callback: function (array $operator, mixed $progress) use ($normalisedOperators): void {
                $progress->hint("Normalising operator {$operator['name']}...");
                $normalisedOperators->push(fluent([
                    'id' => ($operator['id']),
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
    }

    public function territories(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $territories */
        $territories = $this->data->territories;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedTerritories */
        $normalisedTerritories = $this->normalised->territories;

        progress(
            label: 'Normalising territories',
            steps: $territories,
            callback: function (array $territory, mixed $progress) use ($normalisedTerritories): void {
                $progress->hint("Normalising territory {$territory['name']}...");
                $normalisedTerritories->push(fluent([
                    'id' => ($territory['id']),
                    'name' => $territory['name'],
                    'operator_id' => ($territory['operator_id']),
                    'closed_at' => $territory['status'] === 'suspended' ? $territory['updated_at'] : null,
                    'created_at' => $territory['created_at'],
                    'updated_at' => $territory['updated_at'],
                ]));
            }
        );

    }

    public function users(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $users */
        $users = $this->data->users;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $operators */
        $operators = $this->data->operators;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $roles */
        $roles = $this->data->roles;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedUsers */
        $normalisedUsers = $this->normalised->users;

        progress(
            label: 'Normalising users',
            steps: $users,
            callback: function (array $user, mixed $progress) use ($operators, $roles, $normalisedUsers): void {
                $progress->hint("Normalising user {$user['first_name']} {$user['last_name']}...");
                $operator = $operators->get($user['operator_id']);
                $role = $roles->get($user['role_id']);

                $normalisedUsers->push(fluent([
                    'id' => ($user['id']),
                    'operator_id' => ($user['operator_id']),
                    'role_id' => ($user['role_id']),
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'phone' => null,
                    'address' => null,
                    'email' => $user['email'],
                    'email_verified_at' => $user['created_at'],
                    'password' => $user['password'],
                    'remember_token' => $user['remember_token'],
                    'created_at' => $user['created_at'],
                    'updated_at' => $user['updated_at'],
                    '__operator_name' => $operator['name'],
                    '__role_name' => $role['name'],
                ]));
            }
        );
    }

    public function _sites(): void
    {
        $territories = $this->data->territories->keyBy('id');
        $this->normalised->sites = $this->data->sites->map(function (array $site, mixed $key) use ($territories): \Illuminate\Support\Fluent {
            $territory = $territories->get($site['territory_id']);

            return fluent([
                'id' => ($site['id']),
                'name' => $site['name'],
                'address' => $site['address'] ? array_merge((array) json_decode((string) $site['address']), [
                    'latitude' => $site['latitude'],
                    'longitude' => $site['longitude'],
                ]) : null,
                'opening_hours' => $site['opening_hours'] ? json_decode((string) $site['opening_hours']) : null,
                'territory_id' => ($site['territory_id']),
                'operator_id' => ($territory['operator_id']),
                'run_id' => $site['run_id'] ?: null,
                'run_order' => $site['order'],
                'manager_code' => $site['manager_code'] ?? mb_str_pad(''.random_int(0, 9999), 4, '0', STR_PAD_LEFT),
                'closed_at' => $site['status'] === 'closed' ? $site['updated_at'] : null,
                'created_at' => $site['created_at'],
                'updated_at' => $site['updated_at'],
            ]);
        });
    }

    public function _placements(): void
    {
        $sites = $this->data->sites->keyBy('id');
        $territories = $this->data->territories->keyBy('id');
        $this->normalised->placements = $this->data->placements->map(function (array $placement) use ($sites, $territories): \Illuminate\Support\Fluent {
            $site = $sites->get($placement['site_id']);
            $territory = $territories->get($site['territory_id']);

            return fluent([
                'id' => ($placement['id']),
                'site_id' => ($placement['site_id']),
                'territory_id' => ($site['territory_id']),
                'operator_id' => ($territory['operator_id']),
                'snackware_id' => ($placement['snackware_id']),
                'location' => $placement['location'],
                'note' => $placement['note'],
                'closed_at' => $placement['status'] === 'closed' ? $placement['updated_at'] : null,
                'created_at' => $placement['created_at'],
                'updated_at' => $placement['updated_at'],
            ]);
        });
    }

    public function snackware(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $snackwareData */
        $snackwareData = $this->data->snackware;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $territories */
        $territories = $this->data->territories;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $snackwareProducts */
        $snackwareProducts = $this->data->snackware_products;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $products */
        $products = $this->data->products;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedSnackware */
        $normalisedSnackware = $this->normalised->snackware;

        progress(
            label: 'Normalising snackware',
            steps: $snackwareData,
            callback: function (array $snackware, mixed $progress) use ($territories, $snackwareProducts, $products, $normalisedSnackware): void {
                $progress->hint("Normalising snackware {$snackware['name']}...");
                $territory = $territories->get($snackware['territory_id']);
                $snackware_products = $snackwareProducts->where('snackware_id', $snackware['id']);
                $productsList = $products->whereIn('id', $snackware_products->pluck('product_id'));
                $normalisedSnackware->push(fluent([
                    'id' => ($snackware['id']),
                    'territory_id' => ($snackware['territory_id']),
                    'operator_id' => ($territory['operator_id']),
                    'name' => $snackware['name'],
                    'type' => $snackware['type'],
                    'price' => $snackware['legacy_price'],
                    'closed_at' => $snackware['status'] === 'closed' ? $snackware['updated_at'] : null,
                    'created_at' => $snackware['created_at'],
                    'updated_at' => $snackware['updated_at'],
                    '__product_count' => $productsList->count(),
                    '__wholesale_from' => $productsList->min('retail_price') ?? 0,
                    '__wholesale_to' => $productsList->max('retail_price') ?? 0,
                ]));
            }
        );
    }

    public function _runs(): void
    {
        $territories = $this->data->territories->keyBy('id');
        $this->normalised->runs = $this->data->runs->map(function (array $run) use ($territories): \Illuminate\Support\Fluent {
            $territory = $territories->get($run['territory_id']);

            // Strip out "#number" or "R-number" prefixes from run name
            $name = preg_replace('/^(#\d+\s*|R-\d+\s*)/', '', (string) $run['name']);

            return fluent([
                'id' => ($run['id']),
                'name' => $name,
                'territory_id' => ($run['territory_id']),
                'operator_id' => ($territory['operator_id']),
                'schedule' => $run['schedule'],
                'closed_at' => $run['status'] === 'closed' ? $run['updated_at'] : null,
                'created_at' => $run['created_at'],
                'updated_at' => $run['updated_at'],
            ]);
        });
    }

    public function products(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $products */
        $products = $this->data->products;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $manufacturers */
        $manufacturers = $this->data->manufacturers;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $productTypes */
        $productTypes = $this->data->product_types;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedProducts */
        $normalisedProducts = $this->normalised->products;

        progress(
            label: 'Normalising products',
            steps: $products,
            callback: function (array $product, mixed $progress) use ($manufacturers, $productTypes, $normalisedProducts): void {
                $progress->hint("Normalising product {$product['name']}...");
                $manufacturer = $manufacturers->get($product['manufacturer_id']);
                $product_type = $productTypes->get($product['product_type_id']);
                $normalisedProducts->push(fluent([
                    'id' => ($product['id']),
                    'manufacturer_id' => ($product['manufacturer_id']),
                    'product_type_id' => ($product['product_type_id']),
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
                    '__manufacturer_name' => $manufacturer['name'],
                    '__product_type_name' => $product_type['name'],
                ]));
            }
        );
    }

    public function product_types(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $productTypes */
        $productTypes = $this->data->product_types;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $products */
        $products = $this->data->products;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedProductTypes */
        $normalisedProductTypes = $this->normalised->product_types;

        progress(
            label: 'Normalising product types',
            steps: $productTypes,
            callback: function (array $product_type, mixed $progress) use ($products, $normalisedProductTypes): void {
                $progress->hint("Normalising product type {$product_type['name']}...");
                $productsList = $products->where('product_type_id', $product_type['id'])->whereNull('closed_at');
                $normalisedProductTypes->push(fluent([
                    'id' => ($product_type['id']),
                    'name' => $product_type['name'],
                    'short_name' => $product_type['short_name'],
                    'closed_at' => $product_type['status'] === 'inactive' ? $product_type['updated_at'] : null,
                    'created_at' => $product_type['created_at'],
                    'updated_at' => $product_type['updated_at'],
                    '__products_count' => $productsList->count(),
                ]));
            }
        );
    }

    public function manufacturers(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $manufacturers */
        $manufacturers = $this->data->manufacturers;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $products */
        $products = $this->data->products;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedManufacturers */
        $normalisedManufacturers = $this->normalised->manufacturers;

        progress(
            label: 'Normalising manufacturers',
            steps: $manufacturers,
            callback: function (array $manufacturer, mixed $progress) use ($products, $normalisedManufacturers): void {
                $progress->hint("Normalising manufacturer {$manufacturer['name']}...");
                $productsList = $products->where('manufacturer_id', $manufacturer['id'])->whereNull('closed_at');
                $normalisedManufacturers->push(fluent([
                    'id' => ($manufacturer['id']),
                    'name' => $manufacturer['name'],
                    'closed_at' => $manufacturer['status'] === 'inactive' ? $manufacturer['updated_at'] : null,
                    'created_at' => $manufacturer['created_at'],
                    'updated_at' => $manufacturer['updated_at'],
                    '__products_count' => $productsList->count(),
                ]));
            }
        );
    }

    public function wholesalers(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $wholesalers */
        $wholesalers = $this->data->wholesalers;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedWholesalers */
        $normalisedWholesalers = $this->normalised->wholesalers;

        progress(
            label: 'Normalising wholesalers',
            steps: $wholesalers,
            callback: function (array $wholesaler, mixed $progress) use ($normalisedWholesalers): void {
                $progress->hint("Normalising wholesaler {$wholesaler['name']}...");
                $normalisedWholesalers->push(fluent([
                    'id' => ($wholesaler['id']),
                    'name' => $wholesaler['name'],
                    'closed_at' => $wholesaler['status'] === 'inactive' ? $wholesaler['updated_at'] : null,
                    'created_at' => $wholesaler['created_at'],
                    'updated_at' => $wholesaler['updated_at'],
                ]));
            }
        );
    }

    public function _transactions(): void
    {
        $territories = $this->data->territories->keyBy('id');
        $sites = $this->data->sites->keyBy('id');
        $placements = $this->data->placements->keyBy('id');
        $resupplies = $this->data->resupplies->keyBy('id');
        $this->normalised->transactions = $this->data->transactions->map(function (array $transaction) use ($territories, $placements, $sites, $resupplies): \Illuminate\Support\Fluent {
            $placement = $placements->get($transaction['placement_id']);
            $site = $sites->get(optional($placement)['site_id']);
            $territory = $territories->get(optional($site)['territory_id']);
            $resupply = $resupplies->get(optional($transaction)['resupply_id']);

            return fluent([
                'id' => ($transaction['id']),
                'placement_id' => ($transaction['placement_id']),
                'resupply_id' => $transaction['resupply_id'] ?: null,
                'reconciliation_id' => $transaction['resupply_id'] ? ($resupply['reconciliation_id']) : null,
                'territory_id' => (optional($territory)['id']),
                'operator_id' => (optional($territory)['operator_id']),
                'site_id' => (optional($site)['id']),
                'snackware_id' => (optional($placement)['snackware_id']),
                'customer_id' => ($transaction['customer_id']),
                'qr_code_id' => $transaction['q_r_code_id'],
                'amount' => $transaction['amount'],
                'merchant_fee' => $transaction['merchant_fee'],
                'type' => $transaction['type'],
                'method' => $transaction['method'],
                'details' => $transaction['details'] ? json_decode((string) $transaction['details']) : null,
                'refunded_at' => $transaction['status'] === 'refunded' ? $transaction['updated_at'] : null,
                'created_at' => $transaction['created_at'],
                'updated_at' => $transaction['updated_at'],
            ]);
        });
    }

    public function _resupplies(): void
    {
        $territories = $this->data->territories->keyBy('id');
        $sites = $this->data->sites->keyBy('id');
        $placements = $this->data->placements->keyBy('id');
        $reconciliations = $this->data->reconciliations->keyBy('id');
        $this->normalised->resupplies = $this->data->resupplies->map(function (array $resupply) use ($territories, $sites, $placements, $reconciliations): \Illuminate\Support\Fluent {
            $placement = $placements->get(($resupply['placement_id']));
            $site = $sites->get($placement['site_id']);
            $territory = $territories->get(($site['territory_id']));
            $reconciliation = $reconciliations->get($resupply['reconciliation_id']);

            return fluent([
                'id' => ($resupply['id']),
                'reconciliation_id' => ($resupply['reconciliation_id']),
                'placement_id' => ($resupply['placement_id']),
                'territory_id' => ($territory['id']),
                'operator_id' => ($territory['operator_id']),
                'site_id' => ($site['id']),
                'snackware_id' => ($placement['snackware_id']),
                'run_id' => $reconciliation['run_id'] ?: null,
                'stock_opening' => $resupply['stock_opening'],
                'stock_remaining' => $resupply['stock_remaining'],
                'stock_damaged' => $resupply['stock_breakage'],
                'average_unit_price' => $resupply['average_unit_price'],
                'completed_at' => $resupply['status'] === 'completed' ? $resupply['updated_at'] : null,
                'created_at' => $resupply['created_at'],
                'updated_at' => $resupply['updated_at'],
            ]);
        });
    }

    public function _reconciliations(): void
    {
        $runs = $this->data->runs->keyBy('id');
        $territories = $this->data->territories->keyBy('id');
        $resupplies = $this->data->resupplies->groupBy('reconciliation_id');
        $placements = $this->data->placements->keyBy('id');
        $sites = $this->data->sites->keyBy('id');
        $this->normalised->reconciliations = $this->data->reconciliations->map(function (array $reconciliation) use ($runs, $territories, $resupplies, $placements, $sites): \Illuminate\Support\Fluent {

            $run = $runs->get($reconciliation['run_id']);
            $territory = $territories->get(optional($run)['territory_id']);

            if (! $run) {
                $resupplies = $resupplies->get($reconciliation['id']);
                $placement = $placements->get($resupplies->first()['placement_id']);
                $site = $sites->get($placement['site_id']);
                $run = $runs->get($site['run_id']);
                $territory = $territories->get($site['territory_id']);
            }

            return fluent([
                'id' => ($reconciliation['id']),
                'run_id' => $reconciliation['run_id'] ?: null,
                'territory_id' => $territory['id'] ?: null,
                'operator_id' => $territory['operator_id'] ?: null,
                'type' => $reconciliation['type'],
                'start_at' => $reconciliation['start_at'],
                'end_at' => $reconciliation['end_at'],
                'completed_at' => $reconciliation['completed_at'],
                'created_at' => $reconciliation['created_at'],
                'updated_at' => $reconciliation['updated_at'],
            ]);
        });
    }

    public function _contacts(): void
    {
        $sites = $this->data->sites->keyBy('id');
        $territories = $this->data->territories->keyBy('id');
        $this->normalised->contacts = $this->data->contacts->map(function (array $contact) use ($sites, $territories): \Illuminate\Support\Fluent {
            $site = $sites->get($contact['site_id']);
            $territory = $territories->get($site['territory_id']);

            return fluent([
                'id' => ($contact['id']),
                'site_id' => ($contact['site_id']),
                'operator_id' => ($territory['operator_id']),
                'territory_id' => ($site['territory_id']),
                'first_name' => $contact['first_name'],
                'last_name' => $contact['last_name'],
                'email' => $contact['email'],
                'phone' => $contact['phone'] ? json_decode((string) $contact['phone']) : null,
                'created_at' => $contact['created_at'],
                'updated_at' => $contact['updated_at'],
            ]);
        });

        $site_without_contacts = $this->data->sites->whereNotIn('id', $this->normalised->contacts->pluck('site_id'));
        $territories = $this->data->territories->keyBy('id');
        $site_without_contacts->each(function (array $site, mixed $key) use ($territories): void {
            $territory = $territories->get($site['territory_id']);
            $this->normalised->contacts->push(fluent([
                'id' => ((string) Str::ulid()),
                'site_id' => ($site['id']),
                'operator_id' => ($territory['operator_id']),
                'territory_id' => ($territory['id']),
                'first_name' => 'Unknown',
                'last_name' => null,
                'email' => null,
                'phone' => null,
                'created_at' => $site['created_at'],
                'updated_at' => $site['updated_at'],
            ]));
        });
    }

    public function _customers(): void
    {
        $this->normalised->customers = $this->data->customers->map(fn (array $customer): \Illuminate\Support\Fluent => fluent([
            'id' => ($customer['id']),
            'first_name' => $customer['first_name'],
            'last_name' => $customer['last_name'],
            'email' => $customer['email'],
            'phone' => $customer['phone'] ? json_decode((string) $customer['phone']) : null,
            'address' => null,
            'created_at' => $customer['created_at'],
            'updated_at' => $customer['updated_at'],
        ]));
    }

    public function _placement_proportions(): void
    {

        $snackware_products = $this->data->snackware_products->groupBy('snackware_id');
        $placements = $this->data->placements->keyBy('id');
        $snackware = $this->data->snackware->keyBy('id');
        $this->normalised->placement_proportions = $this->data->placement_proportions->map(function (array $placement_proportion) use ($snackware_products, $placements, $snackware): \Illuminate\Support\Fluent {
            $placement = $placements->get($placement_proportion['placement_id']);
            $snackware = $snackware->get($placement['snackware_id']);
            $products = $snackware_products->get($snackware['id']) ?? collect([]);
            $product_type_ids = $products->pluck('product_type_id');

            $valid = $product_type_ids->contains($placement_proportion['product_type_id']);

            return fluent([
                'placement_id' => ($placement_proportion['placement_id']),
                'product_type_id' => $valid ? ($placement_proportion['product_type_id']) : '01K1F5HGTW2B4N29ZK2P31KK0Z',
                'proportion' => $placement_proportion['proportion'],
            ]);
        });
        // add a placement proportion for each placement that has no placement proportion
        $placement_proportion_ids = $this->data->placement_proportions->pluck('placement_id');
        $this->data->placements->whereNotIn('id', $placement_proportion_ids);

        // $placements_without_proportions->each(function($placement) {
        //     $this->normalised->placement_proportions->push(fluent([
        //         'placement_id' => strtoupper($placement['id']),
        //         'product_type_id' => '01K1F5HGTW2B4N29ZK2P31KK0Z',
        //         'proportion' => $placement['legacy_stock'] ?? 0,
        //     ]));
        // });

    }

    public function _q_r_codes(): void
    {
        $this->normalised->q_r_codes = $this->data->q_r_codes->map(fn (array $q_r_code): \Illuminate\Support\Fluent => fluent([
            'id' => ($q_r_code['id']),
            'operator_id' => ($q_r_code['operator_id']),
            'code' => $q_r_code['code'],
            'placement_id' => $q_r_code['placement_id'] ?: null,
            'created_at' => $q_r_code['created_at'],
            'updated_at' => $q_r_code['updated_at'],
            'last_printed_at' => $q_r_code['last_printed_at'],
        ]));
    }

    public function _snackware_products(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $dataSnackwareProducts */
        $dataSnackwareProducts = $this->data->snackware_products;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $dataSnackware */
        $dataSnackware = $this->data->snackware;

        $this->normalised->snackware_products = $dataSnackwareProducts->map(fn (array $snackware_product): \Illuminate\Support\Fluent => fluent([
            'snackware_id' => ($snackware_product['snackware_id']),
            'product_id' => ($snackware_product['product_id']),
        ]));

        // attach the unspecified product to snackware that has no products
        $snackware_products = $dataSnackwareProducts->pluck('snackware_id');
        $snackware_without_products = $dataSnackware->whereNotIn('id', $snackware_products);

        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedSnackwareProducts */
        $normalisedSnackwareProducts = $this->normalised->snackware_products;

        $snackware_without_products->each(function (array $snackware, mixed $key) use ($normalisedSnackwareProducts): void {
            $normalisedSnackwareProducts->push(fluent([
                'snackware_id' => ($snackware['id']),
                'product_id' => '01K1F5J88D0J9DZK63T1AMNH52',
            ]));
        });
    }

    public function expenses(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $expenses */
        $expenses = $this->data->expenses;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $wholesalers */
        $wholesalers = $this->data->wholesalers;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedExpenses */
        $normalisedExpenses = $this->normalised->expenses;

        progress(
            label: 'Normalising expenses',
            steps: $expenses,
            callback: function (array $expense, mixed $progress) use ($wholesalers, $normalisedExpenses): void {
                $progress->hint("Normalising expense {$expense['invoice_no']}...");
                $wholesaler = $wholesalers->get($expense['wholesaler_id']);
                $expense_items = $this->data->expense_items->where('expense_id', $expense['id']);

                $normalisedExpenses->push(fluent([
                    'id' => ($expense['id']),
                    'wholesaler_id' => ($expense['wholesaler_id']),
                    'operator_id' => ($expense['operator_id']),
                    'invoice_no' => $expense['invoice_no'],
                    'invoice_date' => $expense['invoice_date'],
                    'completed_at' => $expense['status'] === 'complete' ? $expense['updated_at'] : null,
                    'created_at' => $expense['created_at'],
                    'updated_at' => $expense['updated_at'],
                    '__wholesaler_name' => $wholesaler['name'],
                    '__rebate' => $expense_items->sum('product_rebate'),
                    '__royalty' => $expense_items->sum('product_royalty'),
                    '__cost' => $expense_items->sum('wholesale_cost'),

                ]));
            }
        );
    }

    public function expense_items(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $expenseItems */
        $expenseItems = $this->data->expense_items;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $products */
        $products = $this->data->products;
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>|\Illuminate\Support\Fluent> $normalisedExpenseItems */
        $normalisedExpenseItems = $this->normalised->expense_items;

        progress(
            label: 'Normalising expense items',
            steps: $expenseItems,
            callback: function (array $expense_item, mixed $progress) use ($products, $normalisedExpenseItems): void {
                $progress->hint("Normalising expense item {$expense_item['id']}...");

                $product = $products->get($expense_item['product_id']);

                $normalisedExpenseItems->push(fluent([
                    'id' => $expense_item['id'],
                    'expense_id' => $expense_item['expense_id'],
                    'product_id' => $expense_item['product_id'],
                    'item' => $expense_item['name'],
                    'quantity' => $expense_item['units'],
                    'cost' => $expense_item['wholesale_cost'],
                    'price' => $expense_item['product_rrp'],
                    'units' => $expense_item['product_units'],
                    'rebate' => $expense_item['product_rebate'],
                    'royalty' => $expense_item['product_royalty'],
                    'completed_at' => $expense_item['status'] === 'complete' ? $expense_item['updated_at'] : null,
                    'created_at' => $expense_item['created_at'],
                    'updated_at' => $expense_item['updated_at'],
                    '__product_name' => $product ? $product['name'] : null,
                ]));
            }
        );
    }
}
