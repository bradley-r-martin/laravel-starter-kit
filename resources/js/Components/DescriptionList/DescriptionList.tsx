import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import DescriptionListItem from './DescriptionListItem';
import DescriptionListItems from './DescriptionListItems';
import DescriptionListTitle from './DescriptionListTitle';

interface Composition {
    Items: typeof DescriptionListItems;
    Item: typeof DescriptionListItem;
    Title: typeof DescriptionListTitle;
}

interface DescriptionListProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const DescriptionList: FunctionComponent<DescriptionListProps> & Composition = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('p-3', className)} {...restProps} />;
};
DescriptionList.Items = DescriptionListItems;
DescriptionList.Item = DescriptionListItem;
DescriptionList.Title = DescriptionListTitle;

export default DescriptionList;
