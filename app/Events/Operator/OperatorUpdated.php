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
        public bool $emailTouched = false,
        public ?string $email = null,
        public bool $addressTouched = false,
        public ?Address $address = null,
        public bool $phoneTouched = false,
        public ?Phone $phone = null,
        public bool $entityTouched = false,
        public ?Entity $entity = null,
        public bool $imageTouched = false,
        public ?string $image = null,
    ) {}
}
