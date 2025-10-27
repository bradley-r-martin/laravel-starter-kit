import { Group, GroupProps } from '@mantine/core';
import { FunctionComponent } from 'react';
import SearchControl from './SearchControl';
import SortControl from './SortControl';
import StatusControl from './StatusControl';

interface FiltersComposition {
    Search: typeof SearchControl;
    Sort: typeof SortControl;
    Status: typeof StatusControl;
}

const Filters: FunctionComponent<GroupProps> & FiltersComposition = (props) => {
    const { children, ...restProps } = props;
    return (
        <Group gap="xs" {...restProps}>
            {children}
        </Group>
    );
};
Filters.Search = SearchControl;
Filters.Sort = SortControl;
Filters.Status = StatusControl;

export default Filters;
