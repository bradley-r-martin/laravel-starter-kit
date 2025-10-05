import { GripVerticalIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import { TransferItem } from './TransferInput';

export interface TransferInputItemProps {
    item: TransferItem;
    onClick: () => void;
    variant?: 'available' | 'selected';
    renderItem?: (item: TransferItem) => React.ReactNode;
    orderable?: boolean;
}

const TransferInputItem: FunctionComponent<TransferInputItemProps> = ({
    item,
    onClick,
    renderItem,
    orderable = false,
}) => {
    return (
        <div className="flex flex-1 items-center gap-2 overflow-hidden rounded p-2 !text-sm focus-within:!bg-blue-500/10 hover:bg-blue-500/10">
            {orderable && (
                <div className="w-0 flex-shrink-0 overflow-hidden rounded p-1 transition-all duration-200 group-hover:w-6 hover:bg-zinc-100">
                    <GripVerticalIcon
                        className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
                        size={16}
                    />
                </div>
            )}
            <button type="button" className="flex-1 overflow-hidden text-left" onClick={onClick}>
                {renderItem ? renderItem(item) : item.label}
            </button>
        </div>
    );
};

export default TransferInputItem;
