<?php

declare(strict_types=1);

namespace App\Events\Operator;

use App\Domain\Address;
use App\Domain\Entity;
use App\Domain\Phone;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

final class OperatorUpdated extends ShouldBeStored
{
    public function __construct(
        public ?string $name = null,
        public ?string $email = null,
        public ?Address $address = null,
        public ?Phone $phone = null,
        public ?Entity $entity = null,
        public ?string $image = null,
    ) {}
}
