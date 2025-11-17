import { ActionIcon } from '@mantine/core';
import { CircleArrowLeftIcon, CircleArrowRightIcon } from 'lucide-react';

import { FunctionComponent } from 'react';

export interface TransferInputActionsProps {
    onAddAll: () => void;
    onRemoveAll: () => void;
    canAddAll: boolean;
    canRemoveAll: boolean;
    disabled?: boolean;
}

const TransferInputActions: FunctionComponent<TransferInputActionsProps> = ({
    onAddAll,
    onRemoveAll,
    canAddAll,
    canRemoveAll,
    disabled = false,
}) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="h-full w-px bg-zinc-950/10"></div>
            <ActionIcon
                variant="transparent"
                size="sm"
                radius="xl"
                color="zinc"
                onClick={onAddAll}
                disabled={disabled || !canAddAll}
            >
                <CircleArrowRightIcon className="size-6" />
            </ActionIcon>
            <ActionIcon
                variant="transparent"
                size="sm"
                radius="xl"
                color="zinc"
                onClick={onRemoveAll}
                disabled={disabled || !canRemoveAll}
            >
                <CircleArrowLeftIcon className="size-6" />
            </ActionIcon>
            <div className="h-full w-px bg-zinc-950/10"></div>
        </div>
    );
};

export default TransferInputActions;
