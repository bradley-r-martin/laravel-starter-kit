import { useGooglePlacesScript } from '@/Hooks/useGooglePlacesScript';
import { addressToString } from '@/Utilities/Transformers';
import { Autocomplete, AutocompleteProps, Loader, Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    AlertCircleIcon,
    BuildingIcon,
    CircleDashedIcon,
    HouseIcon,
    SearchIcon,
} from 'lucide-react';
import React, { forwardRef, useState } from 'react';
import AddressManualEntry from './ManualEntry';

export interface AddressInputProps
    extends Omit<AutocompleteProps, 'value' | 'onChange' | 'children' | 'data'> {
    allowManualEntry?: boolean;
    allowManualEntryChange?: boolean;
    label?: string;
    value?: Domain.Address | null;
    onChange?: (value: Domain.Address | null) => void;
}

const PlaceIcon = ({ types }: { types: string[] }) => {
    if (types?.includes('premise')) {
        return <HouseIcon className="size-3.5 shrink-0" />;
    }
    if (types.includes('subpremise')) {
        return <BuildingIcon className="size-3.5 shrink-0" />;
    }
    if (types.includes('route')) {
        return <CircleDashedIcon className="size-3.5 shrink-0" />;
    }
    if (types.includes('street_address')) {
        return <CircleDashedIcon className="size-3.5 shrink-0" />;
    }
    return <CircleDashedIcon className="size-3.5 shrink-0" />;
};

const renderOption =
    (predictions: google.maps.places.AutocompletePrediction[]) =>
    ({ option }: { option: { value: string } }) => {
        const { value } = option;
        const prediction = predictions.find((prediction) => prediction.description === value);

        if (value === 'INITIALIZING-ERROR') {
            return (
                <div className="flex w-full items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-2">
                        <AlertCircleIcon className="size-3.5" />
                        <span>Unable to autocomplete addresses.</span>
                    </span>
                    <span className="font-bold underline">Add address manually</span>
                </div>
            );
        }
        if (value === 'SEARCHING') {
            return (
                <div className="flex items-center gap-2 text-xs">
                    <Loader size={10} color="zinc" />
                    <span>Searching...</span>
                </div>
            );
        }
        if (value === 'NO_OPTIONS' || value === 'NO_OPTIONS_MANUAL') {
            return (
                <div className="flex w-full items-center justify-between gap-2 text-xs">
                    <span>No options found.</span>
                    {value === 'NO_OPTIONS_MANUAL' && (
                        <span className="font-bold underline">Add address manually</span>
                    )}
                </div>
            );
        }
        if (value === 'START_TYPING') {
            return (
                <div className="flex items-center gap-2 text-xs">
                    <span>Start typing to search for an address...</span>
                </div>
            );
        }
        if (!prediction) {
            console.log('No prediction found for', value);
            return null;
        }
        const matched_substrings = prediction.matched_substrings ?? [];
        const renderHighlighted = (text: string): React.ReactNode => {
            if (!matched_substrings.length) {
                return text;
            }
            const parts: (string | React.ReactNode)[] = [];
            // Sort by offset to process in order
            const sorted = [...matched_substrings].sort((a, b) => a.offset - b.offset);
            let cursor = 0;
            sorted.forEach(({ offset, length }, index) => {
                const start = offset;
                const end = offset + length;
                if (cursor < start) {
                    parts.push(text.slice(cursor, start));
                }
                const match = text.slice(start, end);
                parts.push(<strong key={`m-${index}`}>{match}</strong>);
                cursor = end;
            });
            if (cursor < text.length) {
                parts.push(text.slice(cursor));
            }
            return parts;
        };
        return (
            <div className="flex w-full items-center gap-2 overflow-hidden text-xs">
                <PlaceIcon types={prediction.types} />
                <span className="truncate">{renderHighlighted(value)}</span>
            </div>
        );
    };

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>((props, ref) => {
    const {
        value,
        onChange,
        allowManualEntry = false,
        allowManualEntryChange = false,
        ...autocompleteProps
    } = props;

    const [opened, controls] = useDisclosure(false);
    const [inputValue, setInputValue] = useState<string>('');
    const google = useGooglePlacesScript();

    function results(search: string) {
        if (google.error) {
            return [
                {
                    value: 'INITIALIZING-ERROR',
                },
            ];
        }

        if (search.length < 3) {
            return [
                {
                    value: 'START_TYPING',
                    disabled: true,
                },
            ];
        }

        if (!google.ready) {
            return [
                {
                    value: 'SEARCHING',
                },
            ];
        }

        if (google.predictions.length === 0) {
            return [
                {
                    value: allowManualEntry ? 'NO_OPTIONS_MANUAL' : 'NO_OPTIONS',
                    disabled: !allowManualEntry,
                },
            ];
        }

        return google.predictions.map((prediction) => {
            return {
                value: prediction.description,
                ...prediction,
            };
        });
    }

    return (
        <Popover
            width="auto"
            position="top"
            withArrow
            trapFocus
            withOverlay
            shadow="md"
            opened={opened}
            onChange={controls.close}
        >
            <Popover.Target>
                <Autocomplete
                    ref={ref}
                    value={inputValue}
                    clearable
                    onChange={(value) => {
                        if (value === 'NO_OPTIONS_MANUAL' || value === 'INITIALIZING-ERROR') {
                            return;
                        }
                        setInputValue(value);
                        google.predict(value);
                    }}
                    filter={({ options }) => options}
                    renderOption={renderOption(google.predictions)}
                    data={results(inputValue)}
                    onFocus={(e) => {
                        if (value) {
                            e.currentTarget.select();
                        }
                    }}
                    onBlur={() => {
                        if (value) {
                            setInputValue(addressToString(value));
                        }
                    }}
                    onOptionSubmit={(selected) => {
                        const prediction = google.predictions.find(
                            (prediction) => prediction.description === selected
                        );
                        if (
                            selected === 'NO_OPTIONS_MANUAL' ||
                            selected === 'INITIALIZING-ERROR' ||
                            (prediction?.place_id === value?.place_id && allowManualEntryChange)
                        ) {
                            controls.open();
                            return;
                        }
                        if (!prediction) {
                            return;
                        }
                        google.select(prediction).then((address) => {
                            if (!address) {
                                return;
                            }
                            onChange?.(address);
                            setInputValue(addressToString(address));
                        });
                    }}
                    onClear={() => {
                        onChange?.(null);
                    }}
                    leftSection={
                        value ? (
                            <HouseIcon className="size-3.5" />
                        ) : (
                            <SearchIcon className="size-3.5" />
                        )
                    }
                    {...autocompleteProps}
                />
            </Popover.Target>
            <Popover.Dropdown p={0}>
                {allowManualEntry && (
                    <AddressManualEntry
                        value={value}
                        opened={opened}
                        onClose={controls.close}
                        onSubmit={() => {}}
                    />
                )}
            </Popover.Dropdown>
        </Popover>
    );
});

AddressInput.displayName = 'AddressInput';

export default AddressInput;
