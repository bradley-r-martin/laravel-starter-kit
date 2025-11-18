import { Actions } from '@/Components/Actions';
import ModalHeader from '@/Components/ModalHeader';
import { AUSTRALIA_STATES, COUNTRY, STREET_SUFFIX, STREET_TYPE } from '@/Utilities/Constants';
import { Button, Select, TextInput } from '@mantine/core';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';

interface AddressManualEntryProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (value: Domain.Address | null) => void;
    value?: Domain.Address | null;
    disabled?: boolean;
}

const AddressManualEntry: FunctionComponent<AddressManualEntryProps> = (props) => {
    const { opened, onClose, onSubmit, value, disabled = false } = props;

    const [draft, setDraft] = useState<Domain.Address>(value ?? {});

    useEffect(() => {
        if (opened) {
            setDraft(value ?? {});
        }
    }, [opened, value]);

    const handleChange = (field: keyof Domain.Address, value: string | number | null) => {
        setDraft((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const getStringValue = useCallback(
        (field: keyof Domain.Address) => {
            const fieldValue = draft[field];
            if (fieldValue === null || fieldValue === undefined) {
                return '';
            }

            return typeof fieldValue === 'number' ? String(fieldValue) : fieldValue;
        },
        [draft]
    );

    const handleSubmit = () => {
        onSubmit(draft);
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
                        label="Unit / Apartment"
                        value={getStringValue('unit')}
                        onChange={(e) => handleChange('unit', e.target.value)}
                        disabled={disabled}
                    />
                    <TextInput
                        size="xs"
                        className="flex-1"
                        name={`${name}.lot_no`}
                        label="Lot number"
                        value={getStringValue('lot_no')}
                        onChange={(e) => handleChange('lot_no', e.target.value)}
                        disabled={disabled}
                    />
                    <TextInput
                        size="xs"
                        className="flex-1"
                        name={`${name}.level`}
                        label="Level"
                        value={getStringValue('level')}
                        onChange={(e) => handleChange('level', e.target.value)}
                        disabled={disabled}
                    />
                </div>

                <TextInput
                    size="xs"
                    name={`${name}.building_name`}
                    label="Building name"
                    value={getStringValue('building_name')}
                    onChange={(e) => handleChange('building_name', e.target.value)}
                    disabled={disabled}
                />

                <div className="flex flex-wrap gap-4">
                    <TextInput
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.street_number`}
                        label="Street number"
                        value={getStringValue('street_number')}
                        onChange={(e) => handleChange('street_number', e.target.value)}
                        autoComplete="address-line1"
                        disabled={disabled}
                    />
                    <TextInput
                        size="xs"
                        className="grow"
                        name={`${name}.street_name`}
                        label="Street name"
                        value={getStringValue('street_name')}
                        onChange={(e) => handleChange('street_name', e.target.value)}
                        disabled={disabled}
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <Select
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.street_type`}
                        label="Street type"
                        searchable
                        value={getStringValue('street_type')}
                        onChange={(e) => handleChange('street_type', e)}
                        data={STREET_TYPE}
                        disabled={disabled}
                    />
                    <Select
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.street_suffix`}
                        label="Street suffix"
                        value={getStringValue('street_suffix')}
                        onChange={(e) => handleChange('street_suffix', e)}
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
                        label="Suburb / City"
                        value={getStringValue('suburb')}
                        onChange={(e) => handleChange('suburb', e.target.value)}
                        autoComplete="address-level2"
                        disabled={disabled}
                    />
                    <TextInput
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.postcode`}
                        label="Postcode"
                        value={getStringValue('postcode')}
                        onChange={(e) => handleChange('postcode', e.target.value)}
                        autoComplete="postal-code"
                        disabled={disabled}
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    {getStringValue('country') === 'Australia' ? (
                        <Select
                            size="xs"
                            className="min-w-[150px] flex-1"
                            name={`${name}.state`}
                            label="State / Territory"
                            value={getStringValue('state')}
                            onChange={(e) => handleChange('state', e)}
                            autoComplete="address-level1"
                            searchable
                            data={AUSTRALIA_STATES}
                            disabled={disabled}
                        />
                    ) : (
                        <TextInput
                            size="xs"
                            className="min-w-[150px] flex-1"
                            name={`${name}.state`}
                            label="State / Territory"
                            value={getStringValue('state')}
                            onChange={(e) => handleChange('state', e.target.value)}
                            autoComplete="address-level1"
                            disabled={disabled}
                        />
                    )}
                    <Select
                        size="xs"
                        className="min-w-[150px] flex-1"
                        name={`${name}.country`}
                        label="Country"
                        value={getStringValue('country')}
                        onChange={(e) => handleChange('country', e)}
                        autoComplete="country-name"
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
