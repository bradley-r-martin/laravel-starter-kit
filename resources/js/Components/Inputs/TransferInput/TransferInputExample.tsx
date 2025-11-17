import { Avatar, Group, Text } from '@mantine/core';
import { FunctionComponent } from 'react';
import TransferInput, { TransferItem } from './TransferInput';

const TransferInputExample: FunctionComponent = () => {
    const items: TransferItem[] = [
        { value: '1', label: 'John Doe', description: 'Software Engineer' },
        { value: '2', label: 'Jane Smith', description: 'Product Manager' },
        { value: '3', label: 'Bob Johnson', description: 'Designer' },
        { value: '4', label: 'Alice Brown', description: 'Developer' },
    ];

    const renderItemWithAvatar = (item: TransferItem) => (
        <Group gap="sm">
            <Avatar size="sm" radius="xl">
                {item.label
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
            </Avatar>
            <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                    {item.label}
                </Text>
                {item.description && (
                    <Text size="xs" c="dimmed">
                        {item.description}
                    </Text>
                )}
            </div>
        </Group>
    );

    const renderSimpleItem = (item: TransferItem) => (
        <div>
            <Text size="sm" fw={500}>
                {item.label}
            </Text>
            {item.description && (
                <Text size="xs" c="dimmed">
                    {item.description}
                </Text>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-lg font-semibold">With Avatar and Description</h3>
                <TransferInput
                    label="Select Team Members"
                    items={items}
                    renderItem={renderItemWithAvatar}
                />
            </div>

            <div>
                <h3 className="mb-2 text-lg font-semibold">With Description Only</h3>
                <TransferInput label="Select Users" items={items} renderItem={renderSimpleItem} />
            </div>

            <div>
                <h3 className="mb-2 text-lg font-semibold">Default Rendering</h3>
                <TransferInput label="Select Items" items={items} />
            </div>
        </div>
    );
};

export default TransferInputExample;
