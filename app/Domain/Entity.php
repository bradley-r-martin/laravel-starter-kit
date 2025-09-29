<?php

declare(strict_types=1);

namespace App\Domain;

use Illuminate\Support\Stringable;

final class Entity
{
    public function __construct(
        public ?string $id = null,
        public ?string $type = null
    ) {}

    /**
     * @param  array{id?: string|null, type?: string|null}|null  $attributes
     */
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

    /**
     * @return array{id: string|null, type: string|null}
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
            ->when(
                $this->type !== null,
                fn (Stringable $string): Stringable => $string->prepend('(')->append(') '),
            )
            ->append($this->id ?? '');
    }
}
