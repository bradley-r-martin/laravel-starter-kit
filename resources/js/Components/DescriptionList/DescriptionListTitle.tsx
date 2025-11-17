import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface DescriptionListTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const DescriptionListTitle: FunctionComponent<DescriptionListTitleProps> = (props) => {
    const { className, ...restProps } = props;
    return (
        <div
            className={twMerge(
                'text-base font-semibold tracking-tight text-zinc-950/70 select-none',
                className
            )}
            {...restProps}
        />
    );
};

export default DescriptionListTitle;
