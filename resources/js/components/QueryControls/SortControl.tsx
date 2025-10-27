import useQueryControlReload from '@/hooks/useQueryControlReload';
import { isMobile } from '@/Utilities/Environment';
import { ReloadOptions } from '@inertiajs/core';
import { ActionIcon, Group, Loader } from '@mantine/core';
import { ArrowUpDownIcon, LucideIcon, SortAscIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import AutoWidthSelect from '../AutoWidthSelect';

interface Option {
    value: string;
    label: string;
    icon: LucideIcon;
}

interface SortControlProps {
    attribute: string;
    data: Option[];
    options?: ReloadOptions;
}

const SortControl: FunctionComponent<SortControlProps> = (props) => {
    const { data, options, attribute } = props;
    const [reloading, value, handle] = useQueryControlReload(attribute, 'sort', options);

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
                onChange={(value) => handle(value as string)}
                placeholder="Sort by"
                leftSection={
                    reloading ? (
                        <Loader size={10} color="zinc" />
                    ) : (
                        <ArrowUpDownIcon className="size-3 stroke-[1.5] text-zinc-500" />
                    )
                }
                comboboxProps={{
                    width: 'auto',
                    position: 'bottom-start',
                    withArrow: true,
                    arrowOffset: 10,
                }}
                variant="filled"
                size="xs"
                radius="sm"
                defaultValue={value || data[0].value}
                allowDeselect={false}
                data={data}
                renderOption={({ option, checked }) => {
                    const Icon = data.find((opt) => opt.value === option.value)?.icon;
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

export default SortControl;
