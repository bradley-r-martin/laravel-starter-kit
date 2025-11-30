<?php

declare(strict_types=1);

namespace App\Console\Commands\Migrate;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use stdClass;

use function Laravel\Prompts\progress;

final class Download extends Command
{
    /** @var array<int, string> */
    public array $tables = [
        'operators',
        'territories',
        'users',
        'runs',
        'roles',
        'resupplies',
        'reconciliations',
        'snackware',
        'q_r_codes',
        'sites',
        'placements',
        'products',
        'product_types',
        'manufacturers',
        'wholesalers',
        'transactions',
        'snackware_products',
        'contacts',
        'customers',
        'expenses',
        'expense_items',
        'placement_proportions',
    ];

    protected $signature = 'migrate:download';

    protected $description = 'Download database from remote server';

    public function handle(): void
    {
        $this->download();
    }

    public function download(): void
    {
        progress(
            label: 'Downloading tables',
            steps: $this->tables,
            callback: function (string $table, mixed $progress): void {
                $progress->hint("Downloading {$table}...");
                $data = collect(DB::connection('legacy-system')->table($table)->get());

                switch ($table) {
                    case 'operators':
                    case 'roles':
                    case 'product_types':
                    case 'manufacturers':
                    case 'wholesalers':
                        $data = $data->map(function (stdClass $item): stdClass {
                            $item->id = mb_strtoupper((string) $item->id);

                            return $item;
                        });
                        break;
                    case 'territories':
                        $data = $data->map(function (stdClass $item): stdClass {
                            $item->id = mb_strtoupper((string) $item->id);
                            $item->operator_id = mb_strtoupper((string) $item->operator_id);

                            return $item;
                        });
                        break;
                    case 'users':
                        $data = $data->map(function (stdClass $item): stdClass {
                            $item->id = mb_strtoupper((string) $item->id);
                            $item->operator_id = mb_strtoupper((string) $item->operator_id);
                            $item->role_id = mb_strtoupper((string) $item->role_id);

                            return $item;
                        });
                        break;
                    case 'products':
                        $data = $data->map(function (stdClass $item): stdClass {
                            $item->id = mb_strtoupper((string) $item->id);
                            $item->manufacturer_id = mb_strtoupper((string) $item->manufacturer_id);
                            $item->product_type_id = mb_strtoupper((string) $item->product_type_id);

                            return $item;
                        });
                        break;
                    case 'snackware':
                    case 'runs':
                        $data = $data->map(function (stdClass $item): stdClass {
                            $item->id = mb_strtoupper((string) $item->id);
                            $item->territory_id = mb_strtoupper((string) $item->territory_id);

                            return $item;
                        });
                        break;
                    case 'snackware_products':
                        $data = $data->map(function (stdClass $item): stdClass {
                            $item->snackware_id = mb_strtoupper((string) $item->snackware_id);
                            $item->product_id = mb_strtoupper((string) $item->product_id);

                            return $item;
                        });
                        break;
                    case 'expenses':
                        $data = $data->map(function (stdClass $item): stdClass {
                            $item->id = mb_strtoupper((string) $item->id);
                            $item->wholesaler_id = mb_strtoupper((string) $item->wholesaler_id);
                            $item->operator_id = mb_strtoupper((string) $item->operator_id);

                            return $item;
                        });
                        break;
                    case 'expense_items':
                        $data = $data->map(function (stdClass $item): stdClass {
                            $item->id = mb_strtoupper((string) $item->id);
                            $item->expense_id = mb_strtoupper((string) $item->expense_id);
                            $item->product_id = mb_strtoupper((string) $item->product_id);

                            return $item;
                        });
                        break;
                }

                $progress->hint("Saving {$table}.json");
                Storage::disk('public')->put('migrate/downloaded/'.$table.'.json', $data->toJson(JSON_PRETTY_PRINT));
            }
        );
    }
}
