import Navigate from '@/components/Navigate';
import { useGooglePlacesScript } from '@/XHooks/useGooglePlacesScript';
import {
    ActionIcon,
    Button,
    Group,
    Input,
    InputWrapperProps,
    Loader,
    Paper,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { MapPinIcon } from 'lucide-react';
import {
    FunctionComponent,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import AddressManualEntry from './ManualEntry';
import {
    AddressInputValue,
    createEmptyAddress,
    formatAddressSummary,
    isAddressValueEmpty,
    sanitizeAddressValue,
} from './types';

export interface AddressInputProps extends Omit<InputWrapperProps, 'children'> {
    name: string;
    value?: AddressInputValue | null;
    onChange?: (value: AddressInputValue | null) => void;
    disabled?: boolean;
    /**
     * Render a short helper message underneath the summary card.
     */
    helper?: ReactNode;
    /**
     * Hide the coordinate (latitude/longitude) inputs when not required.
     */
    showCoordinates?: boolean;
}

const AddressInput: FunctionComponent<AddressInputProps> = (props) => {
    const {
        name,
        value,
        onChange,
        disabled = false,
        helper,
        showCoordinates = true,
        label,
        description,
        error,
        required,
        withAsterisk,
        ...restWrapperProps
    } = props;
    const [manualOpen, setManualOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [hasUserEdited, setHasUserEdited] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteRef = useRef<any>(null);
    const { ready, status, error: scriptError } = useGooglePlacesScript();

    const mergedValue = useMemo<AddressInputValue>(() => {
        return {
            ...createEmptyAddress(),
            ...(value ?? {}),
        };
    }, [value]);

    const formattedSummary = useMemo(() => {
        const sanitized = sanitizeAddressValue(mergedValue);
        return isAddressValueEmpty(sanitized)
            ? ''
            : formatAddressSummary(sanitized).filter(Boolean).join(', ');
    }, [mergedValue]);

    useEffect(() => {
        if (!hasUserEdited) {
            setSearchValue(formattedSummary);
        }
    }, [formattedSummary, hasUserEdited]);

    const applyPlaceResult = useCallback(
        (place: any) => {
            const googleWindow = window as typeof window & { google?: any };
            if (!googleWindow.google?.maps?.places) {
                return;
            }

            const components =
                (place.address_components as Array<{
                    long_name?: string;
                    short_name?: string;
                    types: string[];
                }>) ?? [];

            const getComponent = (types: string[], useShort = false): string | null => {
                const component = components.find((comp) =>
                    types.some((type) => comp.types.includes(type))
                );

                if (!component) {
                    return null;
                }

                if (useShort && component.short_name) {
                    return component.short_name;
                }

                return component.long_name ?? null;
            };

            const directionals = new Set([
                'N',
                'S',
                'E',
                'W',
                'NE',
                'NW',
                'SE',
                'SW',
                'NORTH',
                'SOUTH',
                'EAST',
                'WEST',
            ]);

            const streetTypes = new Set([
                'ST',
                'STREET',
                'RD',
                'ROAD',
                'AVE',
                'AVENUE',
                'BLVD',
                'BOULEVARD',
                'DR',
                'DRIVE',
                'CT',
                'COURT',
                'TER',
                'TERRACE',
                'LN',
                'LANE',
                'WAY',
                'CIR',
                'CIRCLE',
                'PL',
                'PLACE',
                'HWY',
                'HIGHWAY',
                'PKWY',
                'PARKWAY',
                'CLOSE',
                'CRES',
                'CRESCENT',
            ]);

            const route = getComponent(['route']);

            let streetName: string | null = route;
            let streetType: string | null = null;
            let streetSuffix: string | null = null;

            if (route) {
                const parts = route.split(' ').filter(Boolean);

                if (parts.length >= 2) {
                    const suffixCandidate = parts[parts.length - 1];
                    if (directionals.has(suffixCandidate.toUpperCase())) {
                        streetSuffix = suffixCandidate;
                        parts.pop();
                    }
                }

                if (parts.length >= 2) {
                    const typeCandidate = parts[parts.length - 1];
                    if (streetTypes.has(typeCandidate.toUpperCase())) {
                        streetType = typeCandidate;
                        parts.pop();
                    }
                }

                streetName = parts.length > 0 ? parts.join(' ') : route;
            }

            const location = place.geometry?.location;
            const latitude = location ? Number(location.lat()) : null;
            const longitude = location ? Number(location.lng()) : null;

            const parsed = sanitizeAddressValue({
                ...createEmptyAddress(),
                place_id: place.place_id ?? null,
                building_name:
                    getComponent(['premise', 'establishment']) ??
                    (place.name && place.name !== route ? place.name : null),
                lot_no: getComponent(['lot', 'lot_number']),
                country: getComponent(['country']) ?? 'Australia',
                level: getComponent(['floor']),
                postcode: getComponent(['postal_code']),
                state: getComponent(['administrative_area_level_1'], true),
                street_name: streetName,
                street_number: getComponent(['street_number']),
                street_type: streetType,
                street_suffix: streetSuffix,
                suburb:
                    getComponent(['locality']) ??
                    getComponent(['postal_town']) ??
                    getComponent(['sublocality', 'sublocality_level_1']),
                unit: getComponent(['subpremise']),
                latitude,
                longitude,
            });

            onChange?.(parsed);

            const summary = formatAddressSummary(parsed).filter(Boolean).join(', ');
            setHasUserEdited(false);
            setSearchValue(summary || place.formatted_address || place.name || '');
        },
        [onChange]
    );

    useEffect(() => {
        if (!ready) {
            return;
        }

        const googleWindow = window as typeof window & { google?: any };
        if (!googleWindow.google?.maps?.places) {
            return;
        }

        const input = searchInputRef.current;
        if (!input) {
            return;
        }

        const autocomplete = new googleWindow.google.maps.places.Autocomplete(input, {
            types: ['address'],
            fields: ['address_components', 'geometry', 'place_id', 'formatted_address', 'name'],
        });

        autocompleteRef.current = autocomplete;

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place) {
                return;
            }

            applyPlaceResult(place);
        });

        return () => {
            listener?.remove?.();
            googleWindow.google?.maps?.event?.clearInstanceListeners?.(autocomplete);
            autocompleteRef.current = null;
        };
    }, [ready, applyPlaceResult]);

    const handleManualSubmit = (nextValue: AddressInputValue | null) => {
        if (nextValue === null) {
            onChange?.(null);
            setHasUserEdited(false);
            setSearchValue('');
        } else {
            const sanitized = sanitizeAddressValue(nextValue);
            onChange?.(sanitized);
            const summary = formatAddressSummary(sanitized).filter(Boolean).join(', ');
            setHasUserEdited(false);
            setSearchValue(summary);
        }

        setManualOpen(false);
    };

    const handleClear = () => {
        onChange?.(null);
        setHasUserEdited(false);
        setSearchValue('');
    };

    const hasValue = value !== null && value !== undefined && !isAddressValueEmpty(mergedValue);
    const summaryLines = hasValue ? formatAddressSummary(mergedValue) : [];
    const summaryText =
        summaryLines.length > 0
            ? summaryLines.join('\n')
            : 'No address provided. Use manual entry to add one.';

    return (
        <Input.Wrapper
            label={label}
            description={description}
            error={error}
            required={required}
            withAsterisk={withAsterisk}
            {...restWrapperProps}
        >
            <Stack gap="xs">
                <Paper withBorder p="md" radius="md">
                    <Stack gap="xs">
                        <TextInput
                            label="Search address"
                            placeholder="Use Google to find an address"
                            value={searchValue}
                            onChange={(event) => {
                                setHasUserEdited(true);
                                setSearchValue(event.currentTarget.value);
                            }}
                            inputRef={searchInputRef}
                            disabled={disabled || !ready}
                            rightSection={
                                status === 'loading' || status === 'idle' ? (
                                    <Loader size="xs" />
                                ) : undefined
                            }
                            error={scriptError ?? undefined}
                        />
                        {!scriptError && status !== 'ready' ? (
                            <Text size="xs" c="dimmed">
                                {status === 'loading'
                                    ? 'Loading Google Places…'
                                    : 'Google Places is not available; you can still enter the address manually.'}
                            </Text>
                        ) : null}

                        <Group gap="xs">
                            <ActionIcon
                                size="sm"
                                variant="light"
                                color="blue"
                                aria-hidden="true"
                                disabled
                            >
                                <MapPinIcon className="size-3.5" />
                            </ActionIcon>
                            <Text size="sm" fw={500}>
                                {hasValue ? 'Manual address' : 'No manual address set'}
                            </Text>
                        </Group>
                        <Text
                            size="sm"
                            c={hasValue ? undefined : 'dimmed'}
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {summaryText}
                        </Text>
                        <Group gap="xs">
                            <Navigate type="manual">
                                <Button
                                    type="button"
                                    variant="light"
                                    size="compact-sm"
                                    onClick={() => setManualOpen(true)}
                                    disabled={disabled}
                                >
                                    {hasValue ? 'Edit address manually' : 'Add address manually'}
                                </Button>
                            </Navigate>
                            <Button
                                type="button"
                                variant="subtle"
                                size="compact-sm"
                                color="gray"
                                onClick={handleClear}
                                disabled={disabled || !hasValue}
                            >
                                Clear
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                {helper ? (
                    <Text size="xs" c="dimmed">
                        {helper}
                    </Text>
                ) : null}

                <AddressManualEntry
                    opened={manualOpen}
                    onClose={() => setManualOpen(false)}
                    value={hasValue ? mergedValue : null}
                    onSubmit={handleManualSubmit}
                    name={name}
                    disabled={disabled}
                    showCoordinates={showCoordinates}
                    helper={helper}
                />
            </Stack>
        </Input.Wrapper>
    );
};

export default AddressInput;

export type { AddressInputValue } from './types';
