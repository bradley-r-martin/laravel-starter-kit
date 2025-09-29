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

    /**
     * @param  array<string, string|float|null>|null  $attributes
     */
    public static function fromArray(?array $attributes): self
    {
        if ($attributes === null || $attributes === []) {
            return new self();
        }

        return new self(
            place_id: isset($attributes['place_id']) ? (string) $attributes['place_id'] : null,
            building_name: isset($attributes['building_name']) ? (string) $attributes['building_name'] : null,
            lot_no: isset($attributes['lot_no']) ? (string) $attributes['lot_no'] : null,
            country: isset($attributes['country']) ? (string) $attributes['country'] : 'Australia',
            level: isset($attributes['level']) ? (string) $attributes['level'] : null,
            postcode: isset($attributes['postcode']) ? (string) $attributes['postcode'] : null,
            state: isset($attributes['state']) ? (string) $attributes['state'] : null,
            street_name: isset($attributes['street_name']) ? (string) $attributes['street_name'] : null,
            street_number: isset($attributes['street_number']) ? (string) $attributes['street_number'] : null,
            street_type: isset($attributes['street_type']) ? (string) $attributes['street_type'] : null,
            street_suffix: isset($attributes['street_suffix']) ? (string) $attributes['street_suffix'] : null,
            suburb: isset($attributes['suburb']) ? (string) $attributes['suburb'] : null,
            unit: isset($attributes['unit']) ? (string) $attributes['unit'] : null,
            latitude: isset($attributes['latitude']) && is_numeric($attributes['latitude']) ? (float) $attributes['latitude'] : null,
            longitude: isset($attributes['longitude']) && is_numeric($attributes['longitude']) ? (float) $attributes['longitude'] : null,
        );
    }

    /**
     * @return array<string, string|float|null>
     */
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

        // Unit/Apartment
        $result = $this->fm($result, $this->unit, '', '/');

        // Lot number
        if ($this->lot_no !== null && $this->lot_no !== '' && $this->lot_no !== '0') {
            $lotNo = preg_replace('/lot\s*/i', '', (string) $this->lot_no);
            $result = $this->fm($result, $lotNo, 'Lot ', ' ');
        }

        // Level
        $result = $this->fm($result, $this->level, 'Level ', ', ');

        // Building name
        $result = $this->fm($result, $this->building_name, '', ', ');

        // Street address
        $result = $this->fm($result, $this->street_number, '', ' ');
        $result = $this->fm($result, $this->street_name, '', ' ');
        $result = $this->fm($result, $this->street_type, '', ' ');
        $result = $this->fm($result, $this->street_suffix, '', '');

        // Suburb
        $result = $this->fm($result, $this->suburb !== null ? (string) str($this->suburb)->title() : null, ', ');

        // State
        $result = $this->fm($result, $this->state !== null ? (string) str($this->state)->upper() : null, ', ');

        // Postcode
        $result = $this->fm($result, $this->postcode, ' ');

        // Country
        if ($this->country !== '' && $this->country !== '0') {
            $result = $this->fm($result, (string) str($this->country)->title(), ', ');
        }

        return mb_trim((string) preg_replace('/^,\s*/', '', $result));
    }

    private function fm(string $base, ?string $part, string $prefix = '', string $suffix = ''): string
    {
        return $part !== null && $part !== '' && $part !== '0'
            ? $base.$prefix.$part.$suffix
            : $base;
    }
}
