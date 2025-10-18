import { Paginated } from '@/types';
import { isMobile } from '@/Utilities/Environment';
import { ReloadOptions } from '@inertiajs/core';
import { ActionIcon } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import Search from './Search';

interface MobileSearchProps {
    data: Paginated<unknown>;
    attribute: string;
    options?: ReloadOptions;
}

const MobileSearch: FunctionComponent<MobileSearchProps> = (props) => {
    const { data, attribute, options } = props;
    if (isMobile()) {
        return (
            <ActionIcon variant="transparent" color="zinc" radius="xl" size="lg">
                <SearchIcon className="size-4" />
            </ActionIcon>
        );
    }

    return <Search {...{ data, attribute, options }} />;
};

export default MobileSearch;
