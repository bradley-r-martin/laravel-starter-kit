import { Avatar, Group, Stack, Text } from '@mantine/core';
import { FunctionComponent, ReactNode } from 'react';

interface NavatarProps {
    name: string | null;
    subtitle?: ReactNode;
    src?: string | null;
    icon?: ReactNode;
    color?: string;
}

const Navatar: FunctionComponent<NavatarProps> = (props) => {
    const { name, src, icon, color = 'initials', subtitle } = props;
    return (
        <Group>
            <Avatar color={color} radius="sm" size="sm" name={name || ''} src={src}>
                {icon}
            </Avatar>
            <Stack gap={0} className="select-none">
                <Text fw={500} size="sm">
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
