import { STREET_TYPE } from './Constants';

export function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function toUpperCase(str: string): string {
    return str.toUpperCase();
}

export function toLowerCase(str: string): string {
    return str.toLowerCase();
}

export function appendIfPresent(base: string, part?: string, prefix = '', suffix = ''): string {
    return part && part.length > 0 ? base + prefix + part + suffix : base;
}

export function addressToString(address: Domain.Address): string {
    let result = '';

    result = appendIfPresent(result, address?.unit, '', '/');
    if (address.lot_no) {
        result = appendIfPresent(result, `${address.lot_no}`.replace(/lot\s*/gi, ''), 'Lot. ', ' ');
    }
    result = appendIfPresent(result, address?.level, ' Level ', ', ');
    result = appendIfPresent(result, address?.building_name, ' ', ' ');
    result = appendIfPresent(result, address?.street_number);
    result = appendIfPresent(result, address?.street_name, ' ');
    result = appendIfPresent(result, address?.street_type, ' ');
    result = appendIfPresent(result, address?.street_suffix, ' ');
    result = appendIfPresent(result, address?.suburb, ', ');
    result = appendIfPresent(result, address?.state, ', ');
    result = appendIfPresent(result, address?.postcode, ' ');
    result = appendIfPresent(result, address?.country, ', ');
    return result.replace(/^,/, '').trim();
}

export function addressToEnvelopeString(address: Domain.Address): string {
    const lines: string[] = [];

    // Line 1: Building/Unit/Level information (if any)
    let buildingLine = '';
    if (address.building_name) {
        buildingLine = address.building_name.trim();
    }
    if (address.level) {
        buildingLine = buildingLine
            ? `${buildingLine}, Level ${address.level}`
            : `Level ${address.level}`;
    }
    if (buildingLine) {
        lines.push(buildingLine);
    }

    // Line 2: Street address
    let streetLine = '';

    // Add unit/apartment
    if (address.unit) {
        streetLine += `${address.unit}/`;
    }

    // Add lot number
    if (address.lot_no) {
        const lotNo = address.lot_no.replace(/lot\s*/gi, '').trim();
        streetLine += `Lot ${lotNo} `;
    }

    // Add street number
    if (address.street_number) {
        streetLine += address.street_number;
    }

    // Add street name
    if (address.street_name) {
        streetLine += (streetLine ? ' ' : '') + address.street_name;
    }

    // Add street type
    if (address.street_type) {
        streetLine += ' ' + address.street_type;
    }

    // Add street suffix
    if (address.street_suffix) {
        streetLine += ' ' + address.street_suffix;
    }

    if (streetLine.trim()) {
        lines.push(streetLine.trim().toUpperCase());
    }

    // Line 3: Suburb, State, Postcode
    let localityLine = '';
    if (address.suburb) {
        localityLine = address.suburb.toUpperCase();
    }

    if (address.state) {
        localityLine += (localityLine ? ' ' : '') + address.state.toUpperCase();
    }

    if (address.postcode) {
        localityLine += (localityLine ? ' ' : '') + address.postcode;
    }

    if (localityLine.trim()) {
        lines.push(localityLine.trim());
    }

    // Line 4: Country
    if (address.country) {
        lines.push(address.country.toUpperCase());
    }

    return lines.filter((line) => line.length > 0).join('\n');
}

export type GeocoderAddressComponent = {
    label: string;
    result: {
        long_name: string;
        short_name: string;
        types: string[];
        geometry?: {
            location: {
                lat: number;
                lng: number;
            };
        };
    }[];
};

export function geocoderToAddress(
    address: string,
    result: google.maps.places.PlaceResult,
    regionSearchOnly = false
): Domain.Address {
    const { address_components, geometry, place_id } = result;
    const label = toLowerCase(`${address}`);

    // pick the easily determined properties from response
    const { short_name: postcode = '' } =
        address_components?.find((curr) => curr.types.includes('postal_code')) || {};
    let { short_name: state = '' } =
        address_components?.find((curr) => curr.types.includes('administrative_area_level_1')) ||
        {};
    let { long_name: street_name = '' } =
        address_components?.find((curr) => curr.types.includes('route')) || {};
    let { short_name: street_number = '' } =
        address_components?.find((curr) => curr.types.includes('street_number')) || {};
    const { long_name: suburb = '' } =
        address_components?.find((curr) => curr.types.includes('locality')) || {};
    const { long_name: country = '' } =
        address_components?.find((curr) => curr.types.includes('country')) || {};
    let unit = '';

    // Google has no concept of "street". See if we recognise a street_type from
    // the route then use that to generate street_name and street_type
    // street_type default to 'street' if regionSearchOnly is false
    const street = street_name.trim().split(' ');
    const street_typeWith = street[street.length - 1];
    let street_type = !regionSearchOnly ? 'Street' : '';
    if (STREET_TYPE.find((st) => st.label === street_typeWith)) {
        street_type = street_typeWith;
    }

    street_name = street_name.replace(street_type, '').trim();

    // edge case, state is listed as JBT for jervis bay when it should be ACT. Naughty Google
    if (state === 'JBT') {
        state = 'ACT';
    }

    // check for unit / subpremise info by crossreferencing against user input
    const street_numberData = label
        .substring(0, label.indexOf(`${street_name}`.toLowerCase()))
        .trim();
    if (street_numberData !== street_number) {
        if (street_numberData.includes('/')) {
            unit = `${street_numberData.substring(0, street_numberData.indexOf('/'))}`.replace(
                /\D/g,
                ''
            );
        } else {
            street_number = street_numberData;
        }
    }

    // uppercase the street number
    street_number = toUpperCase(street_number);

    return {
        place_id: place_id ?? undefined,
        building_name: '',
        country,
        level: '',
        lot_no: '',
        postcode,
        state,
        street_name,
        street_number,
        street_suffix: '',
        street_type,
        suburb,
        unit,
        latitude: geometry?.location?.lat(),
        longitude: geometry?.location?.lng(),
    };
}
