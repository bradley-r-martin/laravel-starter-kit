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

    /**
     * @return array<string, string>
     */
    public function toArray(): array
    {
        return ['rrule' => $this->rrule];
    }

    /**
     * @return RRule<DateTimeInterface>
     */
    public function instance(): RRule
    {
        return new RRule($this->rrule);
    }

    public function nextOccurrence(?DateTimeInterface $after = null): ?DateTimeInterface
    {
        /** @var DateTimeInterface[] $occurrences */
        $occurrences = $this->instance()->getOccurrencesAfter($after ?? new DateTimeImmutable(), false, 1);

        return $occurrences[0] ?? null;
    }

    /**
     * @return DateTimeInterface[]
     */
    public function allOccurrences(DateTimeInterface $until, int $limit = 100): array
    {
        /** @var DateTimeInterface[] $occurrences */
        $occurrences = $this->instance()->getOccurrencesBetween(new DateTimeImmutable(), $until, $limit);

        return $occurrences;
    }
}
