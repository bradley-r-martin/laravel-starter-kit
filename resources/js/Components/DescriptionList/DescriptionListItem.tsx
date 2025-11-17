import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import DescriptionListItemLabel from './DescriptionListItemLabel';
import DescriptionListItemValue from './DescriptionListItemValue';

interface Composition {
    Label: typeof DescriptionListItemLabel;
    Value: typeof DescriptionListItemValue;
}

interface DescriptionListItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const DescriptionListItem: FunctionComponent<DescriptionListItemProps> & Composition = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('flex space-x-4', className)} {...restProps} />;
};
DescriptionListItem.Label = DescriptionListItemLabel;
DescriptionListItem.Value = DescriptionListItemValue;

export default DescriptionListItem;
