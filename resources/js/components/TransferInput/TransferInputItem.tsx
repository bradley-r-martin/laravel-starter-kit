import { Button } from '@mantine/core';
import { GripVerticalIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import { TransferItem } from './TransferInput';

export interface TransferInputItemProps {
    index: number;
    item: TransferItem;
    onClick: () => void;
    variant?: 'available' | 'selected';
    renderItem?: (item: TransferItem) => React.ReactNode;
    orderable?: boolean;
}

const TransferInputItem: FunctionComponent<TransferInputItemProps> = ({
    index,
    item,
    onClick,
    renderItem,
    orderable = false,
}) => {
    return (
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
            {orderable && (
                <div className="relative flex h-8 w-10 items-center justify-center rounded border border-zinc-950/10 text-xs">
                    {index + 1}

                    <div className="absolute inset-0 flex flex-shrink-0 items-center justify-center overflow-hidden rounded p-1 opacity-0 transition-all duration-200 group-hover:bg-white group-hover:opacity-100">
                        <GripVerticalIcon
                            className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
                            size={16}
                        />
                    </div>
                </div>
            )}
            <Button
                fullWidth
                type="button"
                onClick={onClick}
                variant="subtle"
                color="zinc"
                justify="flex-start"
                size="xs"
                classNames={{
                    root: 'hover:!bg-blue-500/10',
                }}
            >
                {renderItem ? renderItem(item) : item.label}
            </Button>
        </div>
    );
};

export default TransferInputItem;
