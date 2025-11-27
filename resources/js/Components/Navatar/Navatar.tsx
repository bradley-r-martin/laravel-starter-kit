import { Avatar, Group, Stack, Text } from '@mantine/core';
import { FunctionComponent, ReactNode } from 'react';

interface NavatarProps {
    name: string | null;
    subtitle?: ReactNode;
    src?: string | null;
    icon?: ReactNode;
    color?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

const Navatar: FunctionComponent<NavatarProps> = (props) => {
    const { name, src, icon, color = 'initials', subtitle, size = 'sm' } = props;
    return (
        <Group wrap="nowrap">
            <Avatar color={color} radius="sm" size="sm" name={name || ''} src={src}>
                {icon}
            </Avatar>
            <Stack gap={0} className="flex-1 truncate select-none">
                <Text fw={500} size={size}>
                    {name || ''}
                </Text>
                {subtitle && (
                    <Text size="xs" c="dimmed">
                        {subtitle}
                    </Text>
                )}
            </Stack>
        </Group>
    );
};

export default Navatar;
