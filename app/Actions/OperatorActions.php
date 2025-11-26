<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Operator;
use App\Models\Territory;
use App\Models\User;

final class OperatorActions
{
    public Operator $operator;

    public function __construct(
        Operator|string $operator,
    ) {
        if (is_string($operator)) {
            /** @var Operator $operator */
            $operator = Operator::findOrFail($operator);
        }
        $this->operator = $operator;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Operator
    {
        return Operator::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Operator
    {
        $this->operator->update($data);

        // Derived data column updates
        if (array_key_exists('name', $data)) {
            User::where('operator_id', $this->operator->id)->update([
                '__operator_name' => $this->operator->name,
            ]);
            Territory::where('operator_id', $this->operator->id)->update([
                '__operator_name' => $this->operator->name,
            ]);
        }

        return $this->operator;
    }

    public function close(): Operator
    {
        $this->operator->update([
            'closed_at' => now(),
        ]);

        return $this->operator;
    }

    public function reopen(): Operator
    {
        $this->operator->update([
            'closed_at' => null,
        ]);

        return $this->operator;
    }

    public function suspend(): Operator
    {
        $this->operator->update([
            'suspended_at' => now(),
        ]);

        return $this->operator;
    }

    public function unsuspend(): Operator
    {
        $this->operator->update([
            'suspended_at' => null,
        ]);

        return $this->operator;
    }

    public function destroy(): void
    {
        $this->operator->delete();
    }
}
