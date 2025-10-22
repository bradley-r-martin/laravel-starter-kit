import useQueryString from '@/hooks/useQueryString';
import { Paginated } from '@/types';
import { isMobile } from '@/Utilities/Environment';
import { router } from '@inertiajs/react';
import { ActionIcon, Group, Loader } from '@mantine/core';
import { ArrowUpDownIcon, LucideIcon, SortAscIcon } from 'lucide-react';
import { FunctionComponent, useState } from 'react';
import AutoWidthSelect from './AutoWidthSelect';

interface Option {
    value: string;
    label: string;
    icon: LucideIcon;
}

interface MobileSortProps {
    data: Paginated<unknown>;
    attribute: string;
    options: Option[];
}

const MobileSort: FunctionComponent<MobileSortProps> = (props) => {
    const { options, attribute } = props;

    const [searching, setSearching] = useState(false);

    // get attribute_sort from querystring
    const defaultSort = useQueryString(`${attribute}_sort`);

    const handleSort = (value: string) => {
        setSearching(true);
        router.reload({
            only: [attribute],
            data: {
                [`${attribute}_sort`]: value,
            },
            ...options,
            onFinish: () => setSearching(false),
        });
    };

    if (isMobile()) {
        return (
            <ActionIcon variant="transparent" color="zinc" radius="xl" size="lg">
                <SortAscIcon className="size-4" />
            </ActionIcon>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-zinc-600">Sort by:</div>
            <AutoWidthSelect
                onChange={(value) => handleSort(value as string)}
                placeholder="Sort by"
                leftSection={
                    searching ? (
                        <Loader size={10} color="zinc" />
                    ) : (
                        <ArrowUpDownIcon className="size-3 stroke-[1.5] text-zinc-500" />
                    )
                }
                
                comboboxProps={{ width: 'auto', position: 'bottom-start', withArrow: true, arrowOffset: 10 }}
                variant="filled"
                size="xs"
                radius="xl"
                defaultValue={defaultSort || options[0].value}
                allowDeselect={false}
                data={options}
                renderOption={({ option, checked }) => {
                    const Icon = options.find((opt) => opt.value === option.value)?.icon;
                    return (
                        <Group gap="xs">
                            {Icon && (
                                <Icon
                                    className={`size-4 ${checked ? 'text-zinc-950' : 'text-zinc-500'} stroke-[1.5]`}
                                />
                            )}
                            <span style={{ fontWeight: checked ? 600 : 400 }}>{option.label}</span>
                        </Group>
                    );
                }}
            />
        </div>
    );
};

export default MobileSort;
