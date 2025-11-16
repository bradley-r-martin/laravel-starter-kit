type Address = {
    place_id?: string;
    building_name?: string;
    lot_no?: string;
    country?: string;
    level?: string;
    postcode?: string;
    state?: string;
    street_name?: string;
    street_number?: string;
    street_type?: string;
    street_suffix?: string;
    suburb?: string;
    unit?: string;
    latitude?: number;
    longitude?: number;
};

type Prediction = {};

class GoogleAddressLookupService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async predictions(address: string) {
        const response = await fetch(
            `https://  maps.googleapis.com/maps/api/place/autocomplete/json?input=${address}&key=${this.apiKey}`
        );
        const data = await response.json();
        return data;
    }

    async lookup(address: string) {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.apiKey}`
        );
        const data = await response.json();
        return data;
    }
}

export default new GoogleAddressLookupService(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
