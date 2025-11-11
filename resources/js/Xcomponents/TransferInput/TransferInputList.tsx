import { ScrollArea, Text } from '@mantine/core';
import { FunctionComponent, useState } from 'react';
import { TransferItem } from './TransferInput';
import TransferInputItem from './TransferInputItem';

export interface TransferInputListProps {
    items: TransferItem[];
    title: string;
    onItemClick: (item: TransferItem) => void;
    variant?: 'available' | 'selected';
    emptyMessage?: string;
    renderItem?: (item: TransferItem) => React.ReactNode;
    orderable?: boolean;
    onReorder?: (fromIndex: number, toIndex: number) => void;
}

const TransferInputList: FunctionComponent<TransferInputListProps> = ({
    items,
    title,
    onItemClick,
    variant = 'available',
    emptyMessage = 'No items',
    renderItem,
    orderable = false,
    onReorder,
}) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        if (!orderable) return;
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', '');
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        if (!orderable || draggedIndex === null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        if (!orderable || draggedIndex === null || draggedIndex === dropIndex) return;

        e.preventDefault();
        onReorder?.(draggedIndex, dropIndex);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="px-4 pt-4 pb-2 !text-xs text-zinc-500 select-none">
                <span>
                    {title} ({items.length})
                </span>
            </div>
            <ScrollArea h="auto" w="100%">
                <div className="flex flex-col divide-y divide-zinc-950/5 px-2">
                    {items.map((item, index) => (
                        <div
                            key={item.value}
                            className={`group relative flex-1 overflow-hidden py-1`}
                        >
                            <div
                                className={`absolute top-0 right-0 left-0 h-1 -translate-y-1/2 ${draggedIndex === index ? '' : ''} ${
                                    dragOverIndex === index && draggedIndex !== index
                                        ? 'bg-blue-500/90'
                                        : ''
                                }`}
                            />

                            <div
                                draggable={orderable && variant === 'selected'}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={
                                    orderable && variant === 'selected'
                                        ? 'cursor-grab active:cursor-grabbing'
                                        : ''
                                }
                            >
                                <TransferInputItem
                                    index={index}
                                    item={item}
                                    onClick={() => onItemClick(item)}
                                    variant={variant}
                                    renderItem={renderItem}
                                    orderable={orderable && variant === 'selected'}
                                />
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <Text size="xs" c="dimmed" ta="center" py="md">
                            {emptyMessage}
                        </Text>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default TransferInputList;
