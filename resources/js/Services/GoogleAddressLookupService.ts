declare global {
    interface Window {
        __googlePlacesScriptPromise__: Promise<void>;
    }
}

class GoogleAddressLookupService {
    private API_KEY: string;
    private SCRIPT_ID: string = 'google-places-script';

    constructor(API_KEY: string) {
        this.API_KEY = API_KEY;
    }

    public search(address: string) {
        const query = address.trim();
        if (query.length < 3) {
            return Promise.resolve([]);
        }
        return new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
            this.initialize().then(() => {
                const autocompleteService = new window.google.maps.places.AutocompleteService();
                autocompleteService.getPlacePredictions(
                    {
                        input: query,
                        location: new google.maps.LatLng(-35.2802, 149.131),
                        radius: 2000,
                        types: ['address'],
                    },
                    (predictions, status) => {
                        if (
                            status === window.google.maps.places.PlacesServiceStatus.OK &&
                            predictions
                        ) {
                            resolve(predictions);
                        } else {
                            reject(new Error('Error getting predictions: ' + status));
                        }
                    }
                );
            });
        });
    }

    public select(prediction: google.maps.places.AutocompletePrediction) {
        return new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
            this.initialize().then(() => {
                const placesService = new window.google.maps.places.PlacesService(
                    document.createElement('div')
                );
                placesService.getDetails({ placeId: prediction.place_id }, (result, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
                        resolve(result);
                    } else {
                        reject(new Error('Error getting details: ' + status));
                    }
                });
            });
        });
    }

    initialize() {
        if (window.__googlePlacesScriptPromise__) {
            return window.__googlePlacesScriptPromise__;
        }

        window.__googlePlacesScriptPromise__ = new Promise<void>((resolve, reject) => {
            let script = document.getElementById(this.SCRIPT_ID) as HTMLScriptElement | null;

            // If script tag doesn't exist, create it
            if (!script) {
                script = document.createElement('script');
                script.id = this.SCRIPT_ID;
                script.async = true;
                script.defer = true;
                script.src = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&libraries=places`;
                document.head.appendChild(script);
            }

            // If already loaded (Google Maps JS API defines this)
            if (window.google?.maps) {
                resolve();
                return;
            }

            // Add listeners
            script.addEventListener('load', () => resolve(), { once: true });

            script.addEventListener(
                'error',
                () => reject(new Error('Google Places script failed to load.')),
                { once: true }
            );
        });

        return window.__googlePlacesScriptPromise__;
    }
}

export default new GoogleAddressLookupService(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
