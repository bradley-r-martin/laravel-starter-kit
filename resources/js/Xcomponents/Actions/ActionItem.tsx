import { motion } from 'motion/react';
import React from 'react';

export interface ActionItemProps {
    index: number;
    expanded: boolean;
    baseDelay: number;
    stagger: number;
    children: React.ReactNode;
}

const ActionItem: React.FC<ActionItemProps> = ({
    index,
    expanded,
    baseDelay,
    stagger,
    children,
}) => {
    return (
        <motion.span
            style={{ display: 'inline-flex' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={expanded ? { opacity: 1, scale: [0.9, 1.05, 1] } : { opacity: 0, scale: 0.9 }}
            transition={{
                duration: 0.5,
                delay: baseDelay + index * stagger,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.span>
    );
};

export default ActionItem;
