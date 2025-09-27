<?php

declare(strict_types=1);

namespace App\Domain;

final class Phone
{
    public function __construct(
        public ?string $country_code = null,
        public ?string $area_code = null,
        public ?string $number = null,
        public ?string $extension = null,
        public ?string $type = null, // e.g. mobile, home, work
    ) {}

    public static function fromArray(?array $attributes): self
    {
        if ($attributes === null || $attributes === []) {
            return new self();
        }

        return new self(
            country_code: $attributes['country_code'] ?? null,
            area_code: $attributes['area_code'] ?? null,
            number: $attributes['number'] ?? null,
            extension: $attributes['extension'] ?? null,
            type: $attributes['type'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'country_code' => $this->country_code,
            'area_code' => $this->area_code,
            'number' => $this->number,
            'extension' => $this->extension,
            'type' => $this->type,
        ];
    }

    public function formatted(): ?string
    {
        if ($this->number === null || $this->number === '' || $this->number === '0') {
            return null;
        }

        $parts = [];

        if ($this->country_code !== null && $this->country_code !== '' && $this->country_code !== '0') {
            $parts[] = $this->country_code;
        }

        if ($this->area_code !== null && $this->area_code !== '' && $this->area_code !== '0') {
            $parts[] = "({$this->area_code})";
        }

        $parts[] = $this->number;

        if ($this->extension !== null && $this->extension !== '' && $this->extension !== '0') {
            $parts[] = "ext {$this->extension}";
        }

        return implode(' ', $parts);
    }
}
