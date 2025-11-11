import { Button, Text, TextInput } from '@mantine/core';
import { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import { Actions } from '../Actions';
import { AnimatedModal } from '../Modal/AnimatedModal';
import { ModalContent } from '../ModalContent';
import ModalHeader from '../ModalHeader';
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
    onSubmit: (value: AddressInputValue | null) => void;
    value: AddressInputValue | null;
    disabled?: boolean;
    showCoordinates?: boolean;
    name: string;
    helper?: ReactNode;
}

const AddressManualEntry: FunctionComponent<AddressManualEntryProps> = (props) => {
    const {
        opened,
        onClose,
        onSubmit,
        value,
        disabled = false,
        showCoordinates = true,
        name,
        helper,
    } = props;

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
    };

    return (
        <AnimatedModal opened={opened} onClose={onClose} size="md" padding="md">
            <ModalHeader title="Manual address" />

            <ModalContent>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <TextInput
                            className="min-w-[150px] flex-1"
                            name={`${name}.unit`}
                            label={LABELS.unit}
                            value={getStringValue('unit')}
                            onChange={handleChange('unit')}
                            disabled={disabled}
                        />
                        <TextInput
                            className="min-w-[150px] flex-1"
                            name={`${name}.lot_no`}
                            label={LABELS.lot_no}
                            value={getStringValue('lot_no')}
                            onChange={handleChange('lot_no')}
                            disabled={disabled}
                        />
                        <TextInput
                            className="min-w-[150px] flex-1"
                            name={`${name}.level`}
                            label={LABELS.level}
                            value={getStringValue('level')}
                            onChange={handleChange('level')}
                            disabled={disabled}
                        />
                    </div>

                    <TextInput
                        name={`${name}.building_name`}
                        label={LABELS.building_name}
                        value={getStringValue('building_name')}
                        onChange={handleChange('building_name')}
                        disabled={disabled}
                    />

                    <div className="flex flex-wrap gap-4">
                        <TextInput
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
                        <TextInput
                            className="min-w-[150px] flex-1"
                            name={`${name}.street_type`}
                            label={LABELS.street_type}
                            value={getStringValue('street_type')}
                            onChange={handleChange('street_type')}
                            disabled={disabled}
                        />
                        <TextInput
                            className="min-w-[150px] flex-1"
                            name={`${name}.street_suffix`}
                            label={LABELS.street_suffix}
                            value={getStringValue('street_suffix')}
                            onChange={handleChange('street_suffix')}
                            disabled={disabled}
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <TextInput
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
                        <TextInput
                            className="min-w-[150px] flex-1"
                            name={`${name}.state`}
                            label={LABELS.state}
                            value={getStringValue('state')}
                            onChange={handleChange('state')}
                            autoComplete="address-level1"
                            placeholder="NSW"
                            disabled={disabled}
                        />
                        <TextInput
                            className="min-w-[150px] flex-1"
                            name={`${name}.country`}
                            label={LABELS.country}
                            value={getStringValue('country')}
                            onChange={handleChange('country')}
                            autoComplete="country-name"
                            placeholder="Australia"
                            disabled={disabled}
                        />
                    </div>

                    <TextInput
                        name={`${name}.place_id`}
                        label={LABELS.place_id}
                        value={getStringValue('place_id')}
                        onChange={handleChange('place_id')}
                        disabled={disabled}
                    />

                    {showCoordinates ? (
                        <div className="flex flex-wrap gap-4">
                            <TextInput
                                className="min-w-[150px] flex-1"
                                name={`${name}.latitude`}
                                label={LABELS.latitude}
                                value={getStringValue('latitude')}
                                onChange={handleChange('latitude')}
                                type="number"
                                step="any"
                                placeholder="-33.8688"
                                disabled={disabled}
                            />
                            <TextInput
                                className="min-w-[150px] flex-1"
                                name={`${name}.longitude`}
                                label={LABELS.longitude}
                                value={getStringValue('longitude')}
                                onChange={handleChange('longitude')}
                                type="number"
                                step="any"
                                placeholder="151.2093"
                                disabled={disabled}
                            />
                        </div>
                    ) : null}
                    {helper ? (
                        <Text size="xs" c="dimmed">
                            {helper}
                        </Text>
                    ) : null}
                </div>
            </ModalContent>
            <Actions>
                <Button type="button" variant="subtle" onClick={onClose}>
                    Back
                </Button>
                <Button type="button" variant="subtle" onClick={handleReset}>
                    Reset fields
                </Button>
                <Button type="button" onClick={handleSubmit}>
                    Use address
                </Button>
            </Actions>
        </AnimatedModal>
    );
};

export default AddressManualEntry;
