import { isMobile } from '@/Utilities/Environment';
import { Modal, ModalProps } from '@mantine/core';
import { useEffect, useState } from 'react';

export interface AnimatedModalProps extends ModalProps {
    animateOnMount?: boolean;
    onExitTransitionEnd?: () => void;
}

export function AnimatedModal({
    animateOnMount = true,
    opened,
    onExitTransitionEnd,
    transitionProps,
    ...props
}: AnimatedModalProps) {
    // Internal open state starts as false if we want to animate on mount and opened is true
    const [internalOpened, setInternalOpened] = useState(() =>
        animateOnMount && opened ? false : opened
    );

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

    const modalProps = isMobile()
        ? {
              padding: 0,
              xOffset: 0,
              yOffset: 0,
              styles: {
                  content: {
                      maxHeight: '90%',
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      display: 'flex',
                      overflow: 'hidden',
                  },
                  body: {
                      width: '100%',
                  },
              },

              transitionProps: {
                  duration: 250, // faster
                  transition: {
                      in: { transform: 'translateY(0%)' },
                      out: { transform: 'translateY(150%)' },
                      common: { transformOrigin: 'bottom' },
                      transitionProperty: 'transform, opacity',
                  },
              },
          }
        : {
              padding: 0,
              styles: {
                  content: {
                      display: 'flex',
                      overflow: 'hidden',
                  },
                  body: {
                      width: '100%',
                  },
              },
              transitionProps: {
                  transition: 'pop' as const,
                  duration: 250, // faster
                  timingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', // more bounce
              },
          };

    const mergedTransitionProps = {
        ...transitionProps,
        ...modalProps.transitionProps,
        onExited: (...args: unknown[]) => {
            // Call user-provided handler first
            // @ts-expect-error - Mantine typing for Transition callbacks is not strict here
            transitionProps?.onExited?.(...args);
            onExitTransitionEnd?.();
        },
    } as typeof transitionProps;

    return (
        <Modal
            opened={internalOpened}
            {...modalProps}
            transitionProps={mergedTransitionProps}
            classNames={{
                inner: '!items-end lg:!items-center',
                content: 'modal-default',
            }}
            {...props}
        />
    );
}
