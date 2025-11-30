<?php

declare(strict_types=1);

namespace App\Console\Commands\Migrate;

use App\Models\Contact;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\ExpenseItem;
use App\Models\Manufacturer;
use App\Models\MerchantAccount;
use App\Models\Operator;
use App\Models\Placement;
use App\Models\Product;
use App\Models\ProductType;
use App\Models\QrCode;
use App\Models\Resupply;
use App\Models\Role;
use App\Models\Route;
use App\Models\Site;
use App\Models\Snackware;
use App\Models\Territory;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wholesaler;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\progress;

final class Import extends Command
{
    public \Illuminate\Support\Fluent $normalised;

    public \Illuminate\Support\Collection $tables;

    protected $signature = 'migrate:import';

    protected $description = 'Import normalised JSON data into the database';

    /** @var array<int, string> */
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
        'runs',
    ];

    public function handle(): void
    {
        $this->load();
        $this->import();
        $this->info('Import completed successfully!');
    }

    public function load(): void
    {
        $normalisedPath = 'migrate/normalised';

        if (! Storage::disk('public')->exists($normalisedPath)) {
            $this->error("Normalised data directory not found at {$normalisedPath}");
            exit(1);
        }

        $this->tables = collect(Storage::disk('public')->allFiles($normalisedPath))
            ->map(fn (string $file): string => basename($file, '.json'));

        $this->normalised = fluent([]);

        $this->tables->each(function (string $table, mixed $key) use ($normalisedPath): void {
            $content = Storage::disk('public')->get("{$normalisedPath}/{$table}.json");
            $data = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->error("Failed to parse {$table}.json: ".json_last_error_msg());
                exit(1);
            }

            $this->normalised->{$table} = collect($data);
        });
    }

    public function import(): void
    {
        collect($this->order)
            ->sortBy(fn (string $table): int|string|false => array_search($table, $this->order))
            ->each(function (string $table, mixed $key): void {
                if (method_exists($this, $table)) {
                    $this->{$table}();
                }
            });
    }

    public function operators(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $operators */
        $operators = $this->normalised->operators;

        progress(
            label: 'Importing operators',
            steps: $operators,
            callback: function (array $operator, mixed $progress): void {
                $name = (string) ($operator['name'] ?? '');
                $progress->hint("Importing operator {$name}...");
                Operator::updateOrCreate(
                    ['id' => $operator['id']],
                    $operator
                );
            }
        );
    }

    public function territories(): void
    {
        $territories = $this->normalised->territories;
        progress(
            label: 'Importing territories',
            steps: $territories,
            callback: function (array $territory, mixed $progress): void {
                $name = (string) ($territory['name'] ?? '');
                $progress->hint("Importing territory {$name}...");
                Territory::updateOrCreate(
                    ['id' => $territory['id']],
                    $territory
                );
            }
        );
    }

    public function merchant_accounts(): void
    {
        $merchantAccounts = $this->normalised->merchant_accounts;

        progress(
            label: 'Importing merchant accounts',
            steps: $merchantAccounts,
            callback: function (array $account, mixed $progress): void {
                $id = (string) ($account['id'] ?? '');
                $progress->hint("Importing merchant account {$id}...");
                MerchantAccount::updateOrCreate(
                    ['id' => $account['id']],
                    $account
                );
            }
        );
    }

    public function roles(): void
    {
        $roles = $this->normalised->roles;
        progress(
            label: 'Importing roles',
            steps: $roles,
            callback: function (array $role, mixed $progress): void {
                $name = (string) ($role['name'] ?? '');
                $progress->hint("Importing role {$name}...");
                Role::updateOrCreate(
                    ['id' => $role['id']],
                    $role
                );
            }
        );
    }

    public function users(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $users */
        $users = $this->normalised->users;

        progress(
            label: 'Importing users',
            steps: $users,
            callback: function (array $user, mixed $progress): void {
                $email = (string) ($user['email'] ?? '');
                $progress->hint("Importing user {$email}...");
                User::updateOrCreate(
                    ['id' => $user['id']],
                    $user
                );
            }
        );
    }

    public function sites(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $sites */
        $sites = $this->normalised->sites;

        progress(
            label: 'Importing sites',
            steps: $sites,
            callback: function (array $site, mixed $progress): void {
                $name = (string) ($site['name'] ?? '');
                $progress->hint("Importing site {$name}...");
                Site::updateOrCreate(
                    ['id' => $site['id']],
                    $site
                );
            }
        );
    }

    public function placements(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $placements */
        $placements = $this->normalised->placements;

        progress(
            label: 'Importing placements',
            steps: $placements,
            callback: function (array $placement, mixed $progress): void {
                $id = (string) ($placement['id'] ?? '');
                $progress->hint("Importing placement {$id}...");
                Placement::updateOrCreate(
                    ['id' => $placement['id']],
                    $placement
                );
            }
        );
    }

    public function snackware(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $snackware */
        $snackware = $this->normalised->snackware;

        progress(
            label: 'Importing snackware',
            steps: $snackware,
            callback: function (array $snackware, mixed $progress): void {
                $name = (string) ($snackware['name'] ?? '');
                $progress->hint("Importing snackware {$name}...");
                Snackware::updateOrCreate(
                    ['id' => $snackware['id']],
                    $snackware
                );
            }
        );
    }

    public function runs(): void
    {
        /* Runs table from legacy system is now routes table */
        $runs = $this->normalised->runs;

        progress(
            label: 'Importing runs',
            steps: $runs,
            callback: function (array $run, mixed $progress): void {
                $name = (string) ($run['name'] ?? '');
                $progress->hint("Importing run {$name}...");
                Route::updateOrCreate(
                    ['id' => $run['id']],
                    $run
                );
            }
        );
    }

    public function products(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $products */
        $products = $this->normalised->products;

        progress(
            label: 'Importing products',
            steps: $products,
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

    public function product_types(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $productTypes */
        $productTypes = $this->normalised->product_types;

        progress(
            label: 'Importing product types',
            steps: $productTypes,
            callback: function (array $productType, mixed $progress): void {
                $name = (string) ($productType['name'] ?? '');
                $progress->hint("Importing product type {$name}...");
                ProductType::updateOrCreate(
                    ['id' => $productType['id']],
                    $productType
                );
            }
        );
    }

    public function manufacturers(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $manufacturers */
        $manufacturers = $this->normalised->manufacturers;

        progress(
            label: 'Importing manufacturers',
            steps: $manufacturers,
            callback: function (array $manufacturer, mixed $progress): void {
                $name = (string) ($manufacturer['name'] ?? '');
                $progress->hint("Importing manufacturer {$name}...");
                Manufacturer::updateOrCreate(
                    ['id' => $manufacturer['id']],
                    $manufacturer
                );
            }
        );
    }

    public function wholesalers(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $wholesalers */
        $wholesalers = $this->normalised->wholesalers;

        progress(
            label: 'Importing wholesalers',
            steps: $wholesalers,
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

    public function transactions(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $transactions */
        $transactions = $this->normalised->transactions;

        progress(
            label: 'Importing transactions',
            steps: $transactions,
            callback: function (array $transaction, mixed $progress): void {
                $id = (string) ($transaction['id'] ?? '');
                $progress->hint("Importing transaction {$id}...");
                Transaction::updateOrCreate(
                    ['id' => $transaction['id']],
                    $transaction
                );
            }
        );
    }

    public function resupplies(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $resupplies */
        $resupplies = $this->normalised->resupplies;

        progress(
            label: 'Importing resupplies',
            steps: $resupplies,
            callback: function (array $resupply, mixed $progress): void {
                $id = (string) ($resupply['id'] ?? '');
                $progress->hint("Importing resupply {$id}...");
                Resupply::updateOrCreate(
                    ['id' => $resupply['id']],
                    $resupply
                );
            }
        );
    }

    public function contacts(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $contacts */
        $contacts = $this->normalised->contacts;

        progress(
            label: 'Importing contacts',
            steps: $contacts,
            callback: function (array $contact, mixed $progress): void {
                $firstName = (string) ($contact['first_name'] ?? '');
                $lastName = (string) ($contact['last_name'] ?? '');
                $progress->hint("Importing contact {$firstName} {$lastName}...");
                Contact::updateOrCreate(
                    ['id' => $contact['id']],
                    $contact
                );
            }
        );
    }

    public function customers(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $customers */
        $customers = $this->normalised->customers;

        progress(
            label: 'Importing customers',
            steps: $customers,
            callback: function (array $customer, mixed $progress): void {
                $firstName = (string) ($customer['first_name'] ?? '');
                $lastName = (string) ($customer['last_name'] ?? '');
                $progress->hint("Importing customer {$firstName} {$lastName}...");
                Customer::updateOrCreate(
                    ['id' => $customer['id']],
                    $customer
                );
            }
        );
    }

    public function placement_proportions(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $placementProportions */
        $placementProportions = $this->normalised->placement_proportions;

        progress(
            label: 'Importing placement proportions',
            steps: $placementProportions,
            callback: function (array $proportion, mixed $progress): void {
                $progress->hint('Importing placement proportion...');
                DB::table('placement_proportions')->updateOrInsert(
                    [
                        'placement_id' => $proportion['placement_id'],
                        'product_type_id' => $proportion['product_type_id'],
                    ],
                    $proportion
                );
            }
        );
    }

    public function q_r_codes(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $qrCodes */
        $qrCodes = $this->normalised->q_r_codes;

        progress(
            label: 'Importing QR codes',
            steps: $qrCodes,
            callback: function (array $qrCode, mixed $progress): void {
                $code = (string) ($qrCode['code'] ?? '');
                $progress->hint("Importing QR code {$code}...");
                QrCode::updateOrCreate(
                    ['id' => $qrCode['id']],
                    $qrCode
                );
            }
        );
    }

    public function snackware_products(): void
    {
        progress(
            label: 'Importing snackware products',
            steps: $this->normalised->snackware_products,
            callback: function (array $snackware_product, mixed $progress): void {
                $progress->hint('Importing snackware product relationship...');
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

    public function expenses(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $expenses */
        $expenses = $this->normalised->expenses;

        progress(
            label: 'Importing expenses',
            steps: $expenses,
            callback: function (array $expense, mixed $progress): void {
                $invoiceNo = (string) ($expense['invoice_no'] ?? '');
                $progress->hint("Importing expense {$invoiceNo}...");
                Expense::updateOrCreate(
                    ['id' => $expense['id']],
                    $expense
                );
            }
        );
    }

    public function expense_items(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $expenseItems */
        $expenseItems = $this->normalised->expense_items;

        progress(
            label: 'Importing expense items',
            steps: $expenseItems,
            callback: function (array $expenseItem, mixed $progress): void {
                $item = (string) ($expenseItem['item'] ?? '');
                $progress->hint("Importing expense item {$item}...");
                ExpenseItem::updateOrCreate(
                    ['id' => $expenseItem['id']],
                    $expenseItem
                );
            }
        );
    }

    public function reconciliations(): void
    {
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $reconciliations */
        $reconciliations = $this->normalised->reconciliations;

        progress(
            label: 'Importing reconciliations',
            steps: $reconciliations,
            callback: function (array $reconciliation, mixed $progress): void {
                $id = (string) ($reconciliation['id'] ?? '');
                $progress->hint("Importing reconciliation {$id}...");
                DB::table('runs')->updateOrInsert(
                    ['id' => $reconciliation['id']],
                    $reconciliation
                );
            }
        );
    }
}
