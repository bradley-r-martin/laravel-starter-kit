<?php

declare(strict_types=1);

namespace App\Domain;

final class Entity
{
    public function __construct(
        public ?string $id = null,
        public ?string $type = null
    ) {}

    public static function fromArray(?array $attributes): self
    {
        if ($attributes === null || $attributes === []) {
            return new self();
        }

        return new self(
            id: $attributes['id'] ?? null,
            type: $attributes['type'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
        ];
    }

    public function formatted(): ?string
    {
        return str($this->type)->upper()->prepend('(')->append(') ')->append($this->id);
    }
}
