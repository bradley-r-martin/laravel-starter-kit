import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import ActionWellDivider from './ActionWellDivider';
import ActionWellRow from './ActionWellRow';

interface Composition {
    Row: typeof ActionWellRow;
    Divider: typeof ActionWellDivider;
}

interface ActionWellProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const ActionWell: FunctionComponent<ActionWellProps> & Composition = (props) => {
    const { className, ...restProps } = props;
    return (
        <div
            className={twMerge(
                'divide-y divide-zinc-950/10 rounded-lg border border-zinc-950/10 bg-zinc-950/1 text-sm *:p-3',
                className
            )}
            {...restProps}
        />
    );
};
ActionWell.Row = ActionWellRow;
ActionWell.Divider = ActionWellDivider;

export default ActionWell;
