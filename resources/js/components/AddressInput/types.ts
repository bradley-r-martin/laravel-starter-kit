export interface AddressInputValue {
    place_id?: string | null;
    building_name?: string | null;
    lot_no?: string | null;
    country?: string | null;
    level?: string | null;
    postcode?: string | null;
    state?: string | null;
    street_name?: string | null;
    street_number?: string | null;
    street_type?: string | null;
    street_suffix?: string | null;
    suburb?: string | null;
    unit?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
}

export type AddressInputKey = keyof AddressInputValue;

export const ADDRESS_KEYS: AddressInputKey[] = [
    'unit',
    'level',
    'building_name',
    'lot_no',
    'street_number',
    'street_name',
    'street_type',
    'street_suffix',
    'suburb',
    'state',
    'postcode',
    'country',
    'latitude',
    'longitude',
    'place_id',
];

export const LABELS: Record<AddressInputKey, string> = {
    place_id: 'Place ID',
    building_name: 'Building name',
    lot_no: 'Lot number',
    country: 'Country',
    level: 'Level',
    postcode: 'Postcode',
    state: 'State / Territory',
    street_name: 'Street name',
    street_number: 'Street number',
    street_type: 'Street type',
    street_suffix: 'Street suffix',
    suburb: 'Suburb / City',
    unit: 'Unit / Apartment',
    latitude: 'Latitude',
    longitude: 'Longitude',
};

export const createEmptyAddress = (): AddressInputValue => ({
    place_id: null,
    building_name: null,
    lot_no: null,
    country: null,
    level: null,
    postcode: null,
    state: null,
    street_name: null,
    street_number: null,
    street_type: null,
    street_suffix: null,
    suburb: null,
    unit: null,
    latitude: null,
    longitude: null,
});

export const sanitizeFieldValue = (
    value: string | number | null | undefined
): string | number | null => {
    if (value === undefined || value === null) {
        return null;
    }

    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    const trimmed = value.trim();
    if (trimmed === '') {
        return null;
    }

    return trimmed;
};

export const sanitizeAddressValue = (value: AddressInputValue): AddressInputValue => {
    const sanitized: AddressInputValue = {};

    ADDRESS_KEYS.forEach((key) => {
        sanitized[key] = sanitizeFieldValue(value[key]);
    });

    return sanitized;
};

export const isAddressValueEmpty = (value: AddressInputValue): boolean => {
    return ADDRESS_KEYS.every((key) => {
        const current = value[key];
        if (current === null || current === undefined) {
            return true;
        }

        if (typeof current === 'number') {
            return Number.isNaN(current);
        }

        return String(current).trim() === '';
    });
};

const formatSummaryLine = (label: string, value?: string | number | null): string | null => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    return `${label}: ${value}`;
};

export const formatAddressSummary = (value: AddressInputValue): string[] => {
    const segments: string[] = [];

    const firstLine = [value.unit, value.level, value.building_name]
        .filter((segment) => segment && String(segment).trim() !== '')
        .join(', ');

    const streetLine = [
        value.street_number,
        value.street_name,
        value.street_type,
        value.street_suffix,
    ]
        .filter((segment) => segment && String(segment).trim() !== '')
        .join(' ');

    const cityLine = [value.suburb, value.state, value.postcode]
        .filter((segment) => segment && String(segment).trim() !== '')
        .join(' ');

    if (firstLine) {
        segments.push(firstLine);
    }

    if (streetLine) {
        segments.push(streetLine);
    }

    if (cityLine) {
        segments.push(cityLine);
    }

    if (value.country) {
        segments.push(String(value.country));
    }

    const coordinatesLine = [
        formatSummaryLine('Latitude', value.latitude),
        formatSummaryLine('Longitude', value.longitude),
    ]
        .filter(Boolean)
        .join(' · ');

    if (coordinatesLine) {
        segments.push(coordinatesLine);
    }

    return segments;
};
