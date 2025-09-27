<?php

declare(strict_types=1);

namespace App\Domain;

use DateTimeImmutable;
use DateTimeInterface;
use RRule\RRule;
use Stringable;

final class Schedule implements Stringable
{
    public function __construct(
        public string $rrule
    ) {}

    public function __toString(): string
    {
        return $this->rrule;
    }

    public static function fromString(?string $rrule): ?self
    {
        return $rrule !== null && $rrule !== '' && $rrule !== '0' ? new self($rrule) : null;
    }

    public function toArray(): array
    {
        return ['rrule' => $this->rrule];
    }

    public function instance(): RRule
    {
        return new RRule($this->rrule);
    }

    public function nextOccurrence(?DateTimeInterface $after = null): ?DateTimeInterface
    {
        return $this->instance()->getOccurrencesAfter($after ?? new DateTimeImmutable(), false, 1)[0] ?? null;
    }

    public function allOccurrences(DateTimeInterface $until, int $limit = 100): array
    {
        return $this->instance()->getOccurrencesBetween(new DateTimeImmutable(), $until, $limit);
    }
}
