import { motion } from 'motion/react';
import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { innerBaseClasses, outerBaseClasses } from './styles';
import type { Size } from './useMeasuredContentSize';

export interface AnimatedActionsContainerProps
    extends Omit<React.ComponentProps<typeof motion.div>, 'initial' | 'animate' | 'transition'> {
    expanded: boolean;
    size: Size;
    delay: number;
    duration: number;
    className?: string;
}

const AnimatedActionsContainer: React.FC<PropsWithChildren<AnimatedActionsContainerProps>> = ({
    expanded,
    size,
    delay,
    duration,
    className,
    children,
    ...rest
}) => {
    const { width, height } = size;

    return (
        <motion.div
            className={twMerge(outerBaseClasses, className)}
            style={{ overflow: expanded ? 'visible' : 'hidden' }}
            initial={{
                opacity: 0,
                width: 0,
                height: 0,
                borderRadius: 9999,
                backgroundColor: 'rgba(24, 24, 27, 0.9)',
            }}
            animate={{
                opacity: [0, 1, 1],
                width: [0, height, width],
                height: [0, height, height],
                borderRadius: [9999, height / 2, height / 2],
                backgroundColor: ['rgba(24, 24, 27, 0.9)', 'rgba(244, 244, 245, 0.5)'],
            }}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
            {...rest}
        >
            <div className={innerBaseClasses} style={{ whiteSpace: 'nowrap' }}>
                {children}
            </div>
        </motion.div>
    );
};

export default AnimatedActionsContainer;
