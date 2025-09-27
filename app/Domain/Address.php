<?php

declare(strict_types=1);

namespace App\Domain;

final class Address
{
    public function __construct(
        public ?string $place_id = null,
        public ?string $building_name = null,
        public ?string $lot_no = null,
        public string $country = 'Australia',
        public ?string $level = null,
        public ?string $postcode = null,
        public ?string $state = null,
        public ?string $street_name = null,
        public ?string $street_number = null,
        public ?string $street_type = null,
        public ?string $street_suffix = null,
        public ?string $suburb = null,
        public ?string $unit = null,
        public ?float $latitude = null,
        public ?float $longitude = null,
    ) {}

    public static function fromArray(?array $attributes): self
    {
        if (! $attributes) {
            return new self();
        }

        return new self(
            place_id: $attributes['place_id'] ?? null,
            building_name: $attributes['building_name'] ?? null,
            lot_no: $attributes['lot_no'] ?? null,
            country: $attributes['country'] ?? 'Australia',
            level: $attributes['level'] ?? null,
            postcode: $attributes['postcode'] ?? null,
            state: $attributes['state'] ?? null,
            street_name: $attributes['street_name'] ?? null,
            street_number: $attributes['street_number'] ?? null,
            street_type: $attributes['street_type'] ?? null,
            street_suffix: $attributes['street_suffix'] ?? null,
            suburb: $attributes['suburb'] ?? null,
            unit: $attributes['unit'] ?? null,
            latitude: isset($attributes['latitude']) ? (float) $attributes['latitude'] : null,
            longitude: isset($attributes['longitude']) ? (float) $attributes['longitude'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'place_id' => $this->place_id,
            'building_name' => $this->building_name,
            'lot_no' => $this->lot_no,
            'country' => $this->country,
            'level' => $this->level,
            'postcode' => $this->postcode,
            'state' => $this->state,
            'street_name' => $this->street_name,
            'street_number' => $this->street_number,
            'street_type' => $this->street_type,
            'street_suffix' => $this->street_suffix,
            'suburb' => $this->suburb,
            'unit' => $this->unit,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }

    public function formatted(): string
    {
        $result = '';

        function fm(string $base, ?string $part, string $prefix = '', string $suffix = ''): string
        {
            return $part ? $base.$prefix.$part.$suffix : $base;
        }

        // Unit/Apartment
        $result = fm($result, $this->unit, '', '/');

        // Lot number
        if ($this->lot_no) {
            $lotNo = preg_replace('/lot\s*/i', '', (string) $this->lot_no);
            $result = fm($result, $lotNo, 'Lot ', ' ');
        }

        // Level
        $result = fm($result, $this->level, 'Level ', ', ');

        // Building name
        $result = fm($result, $this->building_name, '', ', ');

        // Street address
        $result = fm($result, $this->street_number, '', ' ');
        $result = fm($result, $this->street_name, '', ' ');
        $result = fm($result, $this->street_type, '', ' ');
        $result = fm($result, $this->street_suffix, '', '');

        // Suburb
        $result = fm($result, str($this->suburb)->title(), ', ');

        // State
        $result = fm($result, str($this->state ?? '')->upper(), ', ');

        // Postcode
        $result = fm($result, $this->postcode, ' ');

        if ($this->country) {
            $result = fm($result, str($this->country)->title(), ', ');
        }

        return mb_trim(preg_replace('/^,\s*/', '', $result));
    }
}
