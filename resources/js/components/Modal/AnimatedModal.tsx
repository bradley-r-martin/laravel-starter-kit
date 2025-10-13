import { isMobile } from '@/Utilities/Environment';
import { Drawer, Modal, ModalProps } from '@mantine/core';
import { useEffect, useState } from 'react';

export interface AnimatedModalProps extends ModalProps {
    animateOnMount?: boolean;
    onExitTransitionEnd?: () => void;
}

export function AnimatedModal({ animateOnMount = true, opened, onExitTransitionEnd, transitionProps, ...props }: AnimatedModalProps) {
    // Internal open state starts as false if we want to animate on mount and opened is true
    const [internalOpened, setInternalOpened] = useState(() => (animateOnMount && opened ? false : opened));

    useEffect(() => {
        if (animateOnMount && opened) {
            // If external opened is true, but we start false internally to allow animation
            if (!internalOpened) {
                // Trigger open after mount and next frame
                requestAnimationFrame(() => setInternalOpened(true));
            }
        } else {
            // Just sync internal state to external opened normally
            setInternalOpened(opened);
        }
    }, [opened, animateOnMount, internalOpened]);

    const mergedTransitionProps = {
        ...transitionProps,
        onExited: (...args: unknown[]) => {
            // Call user-provided handler first
            // @ts-expect-error - Mantine typing for Transition callbacks is not strict here
            transitionProps?.onExited?.(...args);
            onExitTransitionEnd?.();
        },
    } as typeof transitionProps;



    return <Modal opened={internalOpened}  transitionProps={mergedTransitionProps} {...props} />;
}
