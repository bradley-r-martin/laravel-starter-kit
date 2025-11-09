import Navigate from '@/components/Navigate';
import {
    ActionIcon,
    Button,
    Group,
    Input,
    InputWrapperProps,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import { MapPinIcon } from 'lucide-react';
import { FunctionComponent, ReactNode, useMemo, useState } from 'react';
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
     * Render a short helper message underneath the grid. Useful for field-level hints.
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

    const mergedValue = useMemo<AddressInputValue>(() => {
        return {
            ...createEmptyAddress(),
            ...(value ?? {}),
        };
    }, [value]);

    const handleManualSubmit = (nextValue: AddressInputValue | null) => {
        if (nextValue === null) {
            onChange?.(null);
        } else {
            onChange?.(sanitizeAddressValue(nextValue));
        }

        setManualOpen(false);
    };

    const handleClear = () => {
        onChange?.(null);
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
