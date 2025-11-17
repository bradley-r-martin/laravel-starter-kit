import { Actions } from '@/Components/Actions';
import ModalHeader from '@/Components/ModalHeader';
import { AUSTRALIA_STATES, COUNTRY, STREET_SUFFIX, STREET_TYPE } from '@/Utilities/Constants';
import { Button, Select, TextInput } from '@mantine/core';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
    AddressInputKey,
    AddressInputValue,
    LABELS,
    createEmptyAddress,
    isAddressValueEmpty,
    sanitizeAddressValue,
} from './types';

interface AddressManualEntryProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (value: Domain.Address | null) => void;
    value?: Domain.Address | null;
    disabled?: boolean;
}

const AddressManualEntry: FunctionComponent<AddressManualEntryProps> = (props) => {
    const { opened, onClose, onSubmit, value, disabled = false } = props;

    const [draft, setDraft] = useState<AddressInputValue>(() => ({
        ...createEmptyAddress(),
        ...(value ?? {}),
    }));

    useEffect(() => {
        if (opened) {
            setDraft({
                ...createEmptyAddress(),
                ...(value ?? {}),
            });
        }
    }, [opened, value]);

    const handleChange =
        (field: AddressInputKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = event.currentTarget.value;
            setDraft((current) => ({
                ...current,
                [field]: rawValue,
            }));
        };

    const handleSelectChange = (field: AddressInputKey) => (value: string | null) => {
        setDraft((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const getStringValue = useCallback(
        (field: AddressInputKey) => {
            const fieldValue = draft[field];
            if (fieldValue === null || fieldValue === undefined) {
                return '';
            }

            return typeof fieldValue === 'number' ? String(fieldValue) : fieldValue;
        },
        [draft]
    );

    const handleReset = () => {
        setDraft(createEmptyAddress());
    };

    const handleSubmit = () => {
        const sanitized = sanitizeAddressValue(draft);
        onSubmit(isAddressValueEmpty(sanitized) ? null : sanitized);
        onClose();
    };

    return (
        <div className="max-h-96 max-w-md space-y-4 overflow-y-auto p-4">
            <ModalHeader title="Manual address" />

            <div className="space-y-4">
                <div className="flex gap-4">
                    <TextInput
                        size="xs"
                        className="flex-1"
                        name={`${name}.unit`}
                        label={LABELS.unit}
                        value={getStringValue('unit')}
                        onChange={handleChange('unit')}
                        disabled={disabled}
                    />
                    <TextInput
                        size="xs"
                        className="flex-1"
                        name={`${name}.lot_no`}
                        label={LABELS.lot_no}
                        value={getStringValue('lot_no')}
                        onChange={handleChange('lot_no')}
                        disabled={disabled}
                    />
                    <TextInput
                        size="xs"
                        className="flex-1"
                        name={`${name}.level`}
                        label={LABELS.level}
                        value={getStringValue('level')}
                        onChange={handleChange('level')}
                        disabled={disabled}
                    />
                </div>

                <TextInput
                    size="xs"
                    name={`${name}.building_name`}
                    label={LABELS.building_name}
                    value={getStringValue('building_name')}
                    onChange={handleChange('building_name')}
                    disabled={disabled}
                />

                <div className="flex flex-wrap gap-4">
                    <TextInput
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.street_number`}
                        label={LABELS.street_number}
                        value={getStringValue('street_number')}
                        onChange={handleChange('street_number')}
                        autoComplete="address-line1"
                        placeholder="123"
                        disabled={disabled}
                    />
                    <TextInput
                        size="xs"
                        className="grow"
                        name={`${name}.street_name`}
                        label={LABELS.street_name}
                        value={getStringValue('street_name')}
                        onChange={handleChange('street_name')}
                        placeholder="George Street"
                        disabled={disabled}
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <Select
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.street_type`}
                        label={LABELS.street_type}
                        searchable
                        value={getStringValue('street_type')}
                        onChange={handleSelectChange('street_type')}
                        data={STREET_TYPE}
                        disabled={disabled}
                    />
                    <Select
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.street_suffix`}
                        label={LABELS.street_suffix}
                        value={getStringValue('street_suffix')}
                        onChange={handleSelectChange('street_suffix')}
                        searchable
                        data={STREET_SUFFIX}
                        disabled={disabled}
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <TextInput
                        size="xs"
                        className="grow"
                        name={`${name}.suburb`}
                        label={LABELS.suburb}
                        value={getStringValue('suburb')}
                        onChange={handleChange('suburb')}
                        autoComplete="address-level2"
                        placeholder="Sydney"
                        disabled={disabled}
                    />
                    <TextInput
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.postcode`}
                        label={LABELS.postcode}
                        value={getStringValue('postcode')}
                        onChange={handleChange('postcode')}
                        autoComplete="postal-code"
                        placeholder="2000"
                        disabled={disabled}
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <Select
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.state`}
                        label={LABELS.state}
                        value={getStringValue('state')}
                        onChange={handleSelectChange('state')}
                        autoComplete="address-level1"
                        placeholder="NSW"
                        searchable
                        data={AUSTRALIA_STATES}
                        disabled={disabled}
                    />
                    <Select
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.country`}
                        label={LABELS.country}
                        value={getStringValue('country')}
                        onChange={handleSelectChange('country')}
                        autoComplete="country-name"
                        placeholder="Australia"
                        searchable
                        data={COUNTRY}
                        disabled={disabled}
                    />
                </div>
            </div>

            <Actions>
                <Button type="button" variant="subtle" onClick={onClose}>
                    Back
                </Button>

                <Button type="button" onClick={handleSubmit}>
                    Use address
                </Button>
            </Actions>
        </div>
    );
};

export default AddressManualEntry;
