import useQueryControlReload from '@/hooks/useQueryControlReload';
import { isMobile } from '@/Utilities/Environment';
import { ReloadOptions } from '@inertiajs/core';
import { ActionIcon, Loader, TextInput, TextInputProps } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { SearchIcon } from 'lucide-react';
import { FunctionComponent } from 'react';

interface SearchControlProps extends Omit<TextInputProps, 'value' | 'onChange'> {
    attribute: string;
    options?: ReloadOptions;
}

const SearchControl: FunctionComponent<SearchControlProps> = (props) => {
    const { options, attribute, ...restProps } = props;
    const [reloading, value, handle] = useQueryControlReload(attribute, 'search', options);

    const handleSearch = useDebouncedCallback(handle, 500);

    if (isMobile()) {
        return (
            <ActionIcon
                variant="transparent"
                color="zinc"
                radius="sm"
                size="lg"
                className="order-1 lg:order-0"
            >
                <SearchIcon className="size-4" />
            </ActionIcon>
        );
    }

    return (
        <TextInput
            leftSection={
                reloading ? <Loader size={10} color="zinc" /> : <SearchIcon className="size-3" />
            }
            classNames={{
                root: 'w-full lg:w-[240px]',
            }}
            // rightSection={
            //     value !== '' ? (
            //         <ActionIcon
            //             variant="light"
            //             radius="xl"
            //             size="xs"
            //             onClick={() => handleSearch('')}
            //         >
            //             <XIcon className="size-3" />
            //         </ActionIcon>
            //     ) : null
            // }
            variant="filled"
            size={isMobile() ? 'sm' : 'xs'}
            radius="sm"
            placeholder="Search"
            defaultValue={value || ''}
            onChange={(event) => handleSearch(event.currentTarget.value)}
            {...restProps}
        />
    );
};

export default SearchControl;
