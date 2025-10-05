import { Input } from '@mantine/core';
import { FunctionComponent, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import TransferInputActions from './TransferInputActions';
import TransferInputList from './TransferInputList';

export interface TransferItem {
    value: string;
    label: string;
    group?: string;
    description?: string;
}

export interface TransferInputProps {
    error?: string;
    label?: string;
    items?: any[];
    value?: string[];
    onChange?: (value: string[]) => void;
    disabled?: boolean;
    renderItem?: (item: any) => React.ReactNode;
    orderable?: boolean;
    className?: string;
}

const TransferInput: FunctionComponent<TransferInputProps> = (props) => {
    const {
        label,
        items = [],
        value,
        onChange,
        disabled = false,
        renderItem,
        orderable = false,
        className,
        ...restProps
    } = props;
    const mainDivRef = useRef<HTMLDivElement>(null);

    const availableItems = items.filter((item) => !value?.includes(item.value));

    // For orderable lists, maintain the order from the value array
    const selectedItems = orderable
        ? (value ?? []).map((val) => items.find((item) => item.value === val)).filter(Boolean)
        : items.filter((item) => value?.includes(item.value));

    const addItem = (item: TransferItem) => {
        console.log('addItem', item);
        if (!value?.includes(item.value)) {
            onChange?.([...(value ?? []), item.value]);
        }
        // Return focus to the main div
        mainDivRef.current?.focus();
    };

    const removeItem = (item: TransferItem) => {
        onChange?.(value?.filter((v) => v !== item.value) ?? []);
        // Return focus to the main div
        mainDivRef.current?.focus();
    };

    const addAllItems = () => {
        const allValues = availableItems.map((item) => item.value);
        console.log('allValues', allValues);
        onChange?.([...(value ?? []), ...allValues]);
        // Return focus to the main div
        mainDivRef.current?.focus();
    };

    const removeAllItems = () => {
        onChange?.([]);
        // Return focus to the main div
        mainDivRef.current?.focus();
    };

    const reorderItems = (fromIndex: number, toIndex: number) => {
        if (!orderable || !value) return;

        const newValue = [...value];
        const [movedItem] = newValue.splice(fromIndex, 1);
        newValue.splice(toIndex, 0, movedItem);

        onChange?.(newValue);
    };

    return (
        <Input.Wrapper label={label} error={restProps.error} className="h-full flex-1">
            <div
                ref={mainDivRef}
                tabIndex={0}
                className={twMerge(
                    'flex h-full overflow-hidden rounded border border-slate-400 shadow focus-within:border-blue-500 focus-within:!bg-blue-500/5 focus-within:ring-2 focus-within:ring-blue-500/20',
                    className
                )}
            >
                <TransferInputList
                    items={availableItems}
                    title="Available"
                    onItemClick={addItem}
                    variant="available"
                    emptyMessage="No available items"
                    renderItem={renderItem}
                />

                <TransferInputActions
                    onAddAll={addAllItems}
                    onRemoveAll={removeAllItems}
                    canAddAll={availableItems.length > 0}
                    canRemoveAll={selectedItems.length > 0}
                    disabled={disabled}
                />

                <TransferInputList
                    items={selectedItems}
                    title="Selected"
                    onItemClick={removeItem}
                    variant="selected"
                    emptyMessage="No selected items"
                    renderItem={renderItem}
                    orderable={orderable}
                    onReorder={reorderItems}
                />
            </div>
        </Input.Wrapper>
    );
};

export default TransferInput;
