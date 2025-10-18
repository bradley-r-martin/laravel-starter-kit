import { Paginated } from '@/types';
import { ReloadOptions } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { ActionIcon, Loader, TextInput, TextInputProps } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { SearchIcon, XIcon } from 'lucide-react';
import { FunctionComponent, useState } from 'react';

interface SearchProps extends Omit<TextInputProps, 'value' | 'onChange'> {
    data: Paginated<unknown>;
    attribute: string;
    options?: ReloadOptions;
}

const Search: FunctionComponent<SearchProps> = (props) => {
    const { options = {}, attribute, ...restProps } = props;

    const [searching, setSearching] = useState(false);

    const handleSearch = useDebouncedCallback(async (value: string) => {
        setSearching(true);
        router.reload({
            only: [attribute],
            data: {
                [`${attribute}_search`]: value,
            },
            ...options,
            onFinish: () => setSearching(false),
        });
    }, 500);

    return (
        <TextInput
            leftSection={
                searching ? <Loader size={10} color="zinc" /> : <SearchIcon className="size-3" />
            }
            classNames={{
                root: 'w-[240px]',
            }}
            rightSection={
                searching ? (
                    <ActionIcon variant="light" radius="xl" size="xs">
                        <XIcon className="size-3" />
                    </ActionIcon>
                ) : null
            }
            variant="filled"
            size="xs"
            radius="xl"
            placeholder="Search"
            onChange={(event) => handleSearch(event.currentTarget.value)}
            {...restProps}
        />
    );
};

export default Search;
