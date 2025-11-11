import { ColorInputProps, Text } from '@mantine/core';
import { motion } from 'motion/react';
import { FunctionComponent } from 'react';
import ModalHeaderRings from './ModalHeaderRings';

interface ModalHeaderProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    color?: ColorInputProps['color'];
    hero?: boolean;
}

const ModalHeader: FunctionComponent<ModalHeaderProps> = (props) => {
    const { title, description, icon, color = 'blue', hero = false } = props;

    return (
        <motion.div
            data-hero={hero}
            className="isolate z-50 flex items-center space-x-4 data-[hero=true]:mx-auto data-[hero=true]:max-w-xs data-[hero=true]:flex-col data-[hero=true]:space-y-4 data-[hero=true]:space-x-0 data-[hero=true]:py-10 data-[hero=true]:text-center"
        >
            {icon && (
                <div className="relative w-max">
                    <motion.div
                        transition={{
                            delay: 0.1,
                            duration: 0.5,
                            ease: [0.22, 2, 0.36, 1],
                        }}
                        initial={{
                            scale: 0.1,
                            y: 5,
                        }}
                        animate={{
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            scale: 0.1,
                            y: 5,
                        }}
                        data-intent={color}
                        className="relative flex size-12 shrink-0 items-center justify-center rounded-full *:data-icon:size-6 data-[intent=blue]:bg-blue-50 data-[intent=blue]:text-blue-600 data-[intent=green]:bg-green-50 data-[intent=green]:text-green-600 data-[intent=red]:bg-red-50 data-[intent=red]:text-red-600 data-[intent=yellow]:bg-yellow-50 data-[intent=yellow]:text-yellow-600"
                    >
                        {icon}
                    </motion.div>
                    <ModalHeaderRings />
                </div>
            )}

            <motion.div
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                initial={{
                    opacity: 0,
                    y: -5,
                }}
                exit={{
                    opacity: 0,
                }}
                transition={{
                    delay: 0.3,
                    duration: 0.5,
                }}
                className="isolate text-shadow-md text-shadow-white"
            >
                <Text size="lg" fw={600} c={color}>
                    {title}
                </Text>
                {description && (
                    <Text size="sm" c="dimmed">
                        {description}
                    </Text>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ModalHeader;
