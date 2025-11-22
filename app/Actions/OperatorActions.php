<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Operator;

final class OperatorActions
{
    public static function create(array $data): Operator
    {
        return Operator::create($data);
    }

    public static function update(Operator|string $operator, array $data): Operator
    {
        if ($operator instanceof Operator) {
            $operator->update($data);

            return $operator;
        }

        return Operator::findOrFail($operator)->update($data);
    }
}
