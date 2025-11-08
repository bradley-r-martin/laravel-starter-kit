<?php

declare(strict_types=1);

namespace App\Aggregates;

use App\Domain\Address;
use App\Domain\Entity;
use App\Domain\Phone;
use App\Events\Operator\OperatorClosed;
use App\Events\Operator\OperatorCreated;
use App\Events\Operator\OperatorDestroyed;
use App\Events\Operator\OperatorReopened;
use App\Events\Operator\OperatorSuspended;
use App\Events\Operator\OperatorUnsuspended;
use App\Events\Operator\OperatorUpdated;
use DateTimeImmutable;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

final class OperatorAggregate extends AggregateRoot
{
    public ?string $name = null;

    public ?string $email = null;

    public ?Address $address = null;

    public ?Phone $phone = null;

    public ?Entity $entity = null;

    public ?string $image = null;

    public ?DateTimeImmutable $suspendedAt = null;

    public ?string $suspendedReason = null;

    public ?DateTimeImmutable $closedAt = null;

    public ?string $closedReason = null;

    public ?DateTimeImmutable $destroyedAt = null;

    public ?string $destroyedReason = null;

    public function create(
        string $name,
        ?string $email = null,
        ?Address $address = null,
        ?Phone $phone = null,
        ?Entity $entity = null,
        ?string $image = null,
    ): self {
        $this->recordThat(new OperatorCreated(
            name: $name,
            email: $email,
            address: $address,
            phone: $phone,
            entity: $entity,
            image: $image,
        ));

        return $this;
    }

    public function update(
        ?string $name = null,
        bool $emailTouched = false,
        ?string $email = null,
        bool $addressTouched = false,
        ?Address $address = null,
        bool $phoneTouched = false,
        ?Phone $phone = null,
        bool $entityTouched = false,
        ?Entity $entity = null,
        bool $imageTouched = false,
        ?string $image = null,
    ): self {
        $this->recordThat(new OperatorUpdated(
            name: $name,
            emailTouched: $emailTouched,
            email: $email,
            addressTouched: $addressTouched,
            address: $address,
            phoneTouched: $phoneTouched,
            phone: $phone,
            entityTouched: $entityTouched,
            entity: $entity,
            imageTouched: $imageTouched,
            image: $image,
        ));

        return $this;
    }

    public function close(
        string $reason,
    ): self {
        $this->recordThat(new OperatorClosed(
            reason: $reason,
        ));

        return $this;
    }

    public function suspend(
        string $reason,
    ): self {
        $this->recordThat(new OperatorSuspended(
            reason: $reason,
        ));

        return $this;
    }

    public function unsuspend(
        string $reason,
    ): self {
        $this->recordThat(new OperatorUnsuspended(
            reason: $reason,
        ));

        return $this;
    }

    public function reopen(
        string $reason,
    ): self {
        $this->recordThat(new OperatorReopened(
            reason: $reason,
        ));

        return $this;
    }

    public function destroy(
        string $reason,
    ): self {
        $this->recordThat(new OperatorDestroyed(
            reason: $reason,
        ));

        return $this;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyOperatorCreated(OperatorCreated $event): void
    {
        $this->name = $event->name;
        $this->email = $event->email;
        $this->address = $event->address;
        $this->phone = $event->phone;
        $this->entity = $event->entity;
        $this->image = $event->image;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyOperatorUpdated(OperatorUpdated $event): void
    {
        if ($event->name !== null) {
            $this->name = $event->name;
        }

        if ($event->emailTouched) {
            $this->email = $event->email;
        }

        if ($event->addressTouched) {
            $this->address = $event->address;
        }

        if ($event->phoneTouched) {
            $this->phone = $event->phone;
        }

        if ($event->entityTouched) {
            $this->entity = $event->entity;
        }

        if ($event->imageTouched) {
            $this->image = $event->image;
        }
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyOperatorSuspended(OperatorSuspended $event): void
    {
        $this->suspendedAt = new DateTimeImmutable();
        $this->suspendedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyOperatorUnsuspended(): void
    {
        $this->suspendedAt = null;
        $this->suspendedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyOperatorClosed(OperatorClosed $event): void
    {
        $this->closedAt = new DateTimeImmutable();
        $this->closedReason = $event->reason;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyOperatorReopened(): void
    {
        $this->closedAt = null;
        $this->closedReason = null;
    }

    /**
     * @phpstan-ignore-next-line
     */
    private function applyOperatorDestroyed(OperatorDestroyed $event): void
    {
        $this->destroyedAt = new DateTimeImmutable();
        $this->destroyedReason = $event->reason;
    }
}
