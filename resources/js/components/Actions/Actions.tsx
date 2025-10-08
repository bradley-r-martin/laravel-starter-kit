import { motion } from 'motion/react';
import type { ComponentProps } from 'react';
import React, { PropsWithChildren, useState } from 'react';
import ActionItem from './ActionItem';
import ActionsDivider from './ActionsDivider';
import AnimatedActionsContainer from './AnimatedActionsContainer';
import { useMeasuredContentSize } from './useMeasuredContentSize';

// Types
export type MotionDivProps = ComponentProps<typeof motion.div>;

export interface ActionsProps extends Omit<MotionDivProps, 'initial' | 'animate' | 'transition'> {
    delay?: number; // seconds
    duration?: number; // seconds
}

interface ActionsComponent extends React.FC<PropsWithChildren<ActionsProps>> {
    divider: typeof ActionsDivider;
}

const Actions: ActionsComponent = ({ children, className, delay = 0, duration = 0.7, ...rest }) => {
    const { targetSize, measureNode } = useMeasuredContentSize(children, className);
    const [expanded, setExpanded] = useState(false);

    if (!targetSize) {
        return <>{measureNode}</>;
    }

    const childArray = React.Children.toArray(children);
    const childBaseDelay = 0.02; // seconds after container finishes
    const childStagger = 0.06; // seconds between children

    return (
        <div className="pt-10">
            <AnimatedActionsContainer
                expanded={expanded}
                size={targetSize}
                delay={delay}
                duration={duration}
                className={className}
                onAnimationComplete={() => setExpanded(true)}
                {...rest}
            >
                {childArray.map((child, index) => (
                    <ActionItem
                        key={index}
                        index={index}
                        expanded={expanded}
                        baseDelay={childBaseDelay}
                        stagger={childStagger}
                    >
                        {child}
                    </ActionItem>
                ))}
            </AnimatedActionsContainer>
        </div>
    );
};

Actions.divider = ActionsDivider;

export default Actions;
