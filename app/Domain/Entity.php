<?php

declare(strict_types=1);

namespace App\Domain;

final class Entity
{
    public function __construct(
        public ?string $id = null,
        public ?string $type = null
    ) {}

    /**
     * @param  array<string, string|null>|null  $attributes
     */
    public static function fromArray(?array $attributes): self
    {
        if ($attributes === null || $attributes === []) {
            return new self();
        }

        return new self(
            id: isset($attributes['id']) ? (string) $attributes['id'] : null,
            type: isset($attributes['type']) ? (string) $attributes['type'] : null,
        );
    }

    /**
     * @return array<string, string|null>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
        ];
    }

    public function formatted(): ?string
    {
        if ($this->id === null && $this->type === null) {
            return null;
        }

        return (string) str($this->type ?? '')
            ->upper()
            ->when($this->type !== null, fn ($s) => $s->prepend('(')->append(') '))
            ->append($this->id ?? '');
    }
}
