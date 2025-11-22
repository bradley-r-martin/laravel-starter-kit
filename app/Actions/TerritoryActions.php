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
        // Add denormalized operator name if operator_id is provided
        if (isset($data['operator_id'])) {
            $data['__operator_name'] = Operator::query()->whereKey($data['operator_id'])->value('name');
        }

        return Territory::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Territory
    {
        // Add denormalized operator name if operator_id is being updated
        if (isset($data['operator_id'])) {
            $data['__operator_name'] = Operator::query()->whereKey($data['operator_id'])->value('name');
        }

        $this->territory->update($data);

        return $this->territory;
    }

    public function close(): Territory
    {
        $this->territory->update([
            'closed_at' => now(),
        ]);

        return $this->territory;
    }

    public function reopen(): Territory
    {
        $this->territory->update([
            'closed_at' => null,
        ]);

        return $this->territory;
    }

    public function destroy(): void
    {
        $this->territory->delete();
    }
}
