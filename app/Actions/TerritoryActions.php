<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Operator;
use App\Models\Territory;

final class TerritoryActions
{
    public Territory $territory;

    public function __construct(
        Territory|string $territory,
    ) {
        if (is_string($territory)) {
            /** @var Territory $territory */
            $territory = Territory::findOrFail($territory);
        }
        $this->territory = $territory;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Territory
    {

        // Handle operator
        if (array_key_exists('operator_id', $data)) {
            $data['__operator_name'] = Operator::find($data['operator_id'])?->name;

            // Derived data column updates
            Operator::whereKey($data['operator_id'])->increment('__territories_count');
        }

        return Territory::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Territory
    {
        // Handle operator
        if (array_key_exists('operator_id', $data)) {
            $data['__operator_name'] = Operator::find($data['operator_id'])?->name;

            // Derived data column updates
            Operator::whereKey($this->territory->operator_id)->decrement('__territories_count');
            Operator::whereKey($data['operator_id'])->increment('__territories_count');
        }

        $this->territory->update($data);

        return $this->territory;
    }

    public function close(): Territory
    {
        $this->territory->update([
            'closed_at' => now(),
        ]);

        // Derived data column updates
        Operator::whereKey($this->territory->operator_id)->decrement('__territories_count');

        return $this->territory;
    }

    public function reopen(): Territory
    {
        $this->territory->update([
            'closed_at' => null,
        ]);

        // Derived data column updates
        Operator::whereKey($this->territory->operator_id)->increment('__territories_count');

        return $this->territory;
    }

    public function destroy(): void
    {
        $this->territory->delete();
    }
}
