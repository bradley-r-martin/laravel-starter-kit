import { getNavigatePointerPosition } from '@/Stores/navigatePointerPosition';
import { isMobile } from '@/Utilities/Environment';
import { Modal, ModalProps } from '@mantine/core';
import { useLayoutEffect, useRef, useState } from 'react';

type PointerPosition = { x: number; y: number };

const BASE_MODAL_PROPS: Pick<ModalProps, 'padding' | 'styles'> = {
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
};

const MOBILE_MODAL_PROPS: Pick<
    ModalProps,
    'padding' | 'styles' | 'xOffset' | 'yOffset' | 'transitionProps'
> = {
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
};

const DEFAULT_TRANSITION_PROPS: NonNullable<ModalProps['transitionProps']> = {
    duration: 0,
    exitDuration: 0,
    transition: 'fade',
    timingFunction: 'linear',
};

interface AnimationTarget {
    transitionNode: HTMLElement;
    overlayElement: HTMLElement | null;
    cleanupOrigin: () => void;
}

const getLatestElement = (selector: string) => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length === 0) {
        return null;
    }

    return elements.item(elements.length - 1);
};

const applyPointerOrigin = (
    element: HTMLElement,
    pointer: PointerPosition
): AnimationTarget | null => {
    const transitionNode = element.closest<HTMLElement>('[data-mantine-transition]') ?? element;
    const transitionRect = transitionNode.getBoundingClientRect();
    const transitionLeft = transitionRect.left + window.scrollX;
    const transitionTop = transitionRect.top + window.scrollY;

    const transformOrigin = `${pointer.x - transitionLeft}px ${pointer.y - transitionTop}px`;

    transitionNode.style.transformOrigin = transformOrigin;
    if (transitionNode !== element) {
        element.style.transformOrigin = transformOrigin;
    }

    const cleanupOrigin = () => {
        if (transitionNode !== element) {
            element.style.transformOrigin = '';
        }
        transitionNode.style.transformOrigin = '';
    };

    return {
        transitionNode,
        overlayElement: getLatestElement('.modal-overlay'),
        cleanupOrigin,
    };
};

const getAnimationTarget = (pointer: PointerPosition): AnimationTarget | null => {
    const element = getLatestElement('.modal-default');
    if (!element) {
        return null;
    }

    return applyPointerOrigin(element, pointer);
};

const resetOverlay = (overlay: HTMLElement | null, opacity: '0' | '1') => {
    if (!overlay) {
        return;
    }

    overlay.style.transition = '';
    overlay.style.opacity = opacity;
    overlay.style.willChange = '';
};

const resetTransitionNode = (node: HTMLElement, cleanupOrigin: () => void) => {
    cleanupOrigin();
    node.style.transition = '';
    node.style.transform = 'scale(0)';
    node.style.opacity = '0';
    node.style.willChange = '';
};

const startOpenAnimation = (pointer: PointerPosition, isClosing: () => boolean) => {
    const target = getAnimationTarget(pointer);
    if (!target) {
        return null;
    }

    const { transitionNode, overlayElement, cleanupOrigin } = target;

    transitionNode.style.transition = 'none';
    transitionNode.style.transform = 'scale(0)';
    transitionNode.style.opacity = '0';
    transitionNode.style.willChange = 'transform, opacity';

    if (overlayElement) {
        overlayElement.style.transition = 'none';
        overlayElement.style.opacity = '0';
        overlayElement.style.willChange = 'opacity';
    }

    const frame = requestAnimationFrame(() => {
        transitionNode.style.transition =
            'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease';
        transitionNode.style.transform = 'scale(1)';
        transitionNode.style.opacity = '1';

        if (overlayElement) {
            overlayElement.style.transition = 'opacity 300ms ease';
            overlayElement.style.opacity = '1';
        }
    });

    return () => {
        cancelAnimationFrame(frame);
        if (!isClosing()) {
            resetTransitionNode(transitionNode, cleanupOrigin);
            resetOverlay(overlayElement, '0');
        }
    };
};

const startCloseAnimation = (pointer: PointerPosition, onComplete: () => void) => {
    const target = getAnimationTarget(pointer);
    if (!target) {
        onComplete();
        return () => {
            // nothing to clean
        };
    }

    const { transitionNode, overlayElement, cleanupOrigin } = target;

    let cancelled = false;

    transitionNode.style.transition = 'none';
    transitionNode.style.transform = 'scale(1)';
    transitionNode.style.opacity = '1';
    transitionNode.style.willChange = 'transform, opacity';

    if (overlayElement) {
        overlayElement.style.transition = 'none';
        overlayElement.style.opacity = '1';
        overlayElement.style.willChange = 'opacity';
    }

    const overlayFrame = overlayElement
        ? requestAnimationFrame(() => {
              if (!cancelled) {
                  overlayElement.style.transition = 'opacity 300ms ease';
                  overlayElement.style.opacity = '0';
              }
          })
        : null;

    const frame = requestAnimationFrame(() => {
        if (!cancelled) {
            transitionNode.style.transition =
                'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease';
            transitionNode.style.transform = 'scale(0)';
            transitionNode.style.opacity = '0';
        }
    });

    const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.target === transitionNode && event.propertyName === 'transform') {
            transitionNode.removeEventListener('transitionend', handleTransitionEnd);
            resetTransitionNode(transitionNode, cleanupOrigin);
            resetOverlay(overlayElement, '0');
            onComplete();
        }
    };

    transitionNode.addEventListener('transitionend', handleTransitionEnd);

    return () => {
        cancelled = true;
        transitionNode.removeEventListener('transitionend', handleTransitionEnd);
        cancelAnimationFrame(frame);

        if (overlayElement && overlayFrame !== null) {
            cancelAnimationFrame(overlayFrame);
            resetOverlay(overlayElement, '1');
        }

        resetTransitionNode(transitionNode, cleanupOrigin);
    };
};

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

    const openAnimationCleanupRef = useRef<(() => void) | null>(null);
    const closeAnimationCleanupRef = useRef<(() => void) | null>(null);
    const isClosingRef = useRef(false);

    const modalProps = isMobile() ? MOBILE_MODAL_PROPS : BASE_MODAL_PROPS;

    useLayoutEffect(() => {
        if (opened) {
            isClosingRef.current = false;

            closeAnimationCleanupRef.current?.();
            closeAnimationCleanupRef.current = null;

            if (!internalOpened) {
                if (animateOnMount) {
                    const frame = requestAnimationFrame(() => setInternalOpened(true));
                    return () => cancelAnimationFrame(frame);
                }

                setInternalOpened(true);
            }

            return;
        }

        if (!internalOpened || isClosingRef.current) {
            return;
        }

        if (isMobile()) {
            openAnimationCleanupRef.current?.();
            openAnimationCleanupRef.current = null;
            setInternalOpened(false);
            onExitTransitionEnd?.();
            return;
        }

        const pointer = getNavigatePointerPosition();
        if (!pointer) {
            openAnimationCleanupRef.current?.();
            openAnimationCleanupRef.current = null;
            setInternalOpened(false);
            onExitTransitionEnd?.();
            return;
        }

        isClosingRef.current = true;

        closeAnimationCleanupRef.current?.();
        closeAnimationCleanupRef.current = null;

        closeAnimationCleanupRef.current = startCloseAnimation(pointer, () => {
            closeAnimationCleanupRef.current = null;
            isClosingRef.current = false;
            openAnimationCleanupRef.current?.();
            openAnimationCleanupRef.current = null;
            setInternalOpened(false);
            onExitTransitionEnd?.();
        });

        return () => {
            closeAnimationCleanupRef.current?.();
            closeAnimationCleanupRef.current = null;
            isClosingRef.current = false;
        };
    }, [opened, internalOpened, animateOnMount, onExitTransitionEnd]);

    const mergedTransitionProps = {
        ...DEFAULT_TRANSITION_PROPS,
        ...transitionProps,
    } as ModalProps['transitionProps'];

    useLayoutEffect(() => {
        if (!internalOpened || isMobile() || isClosingRef.current) {
            return;
        }

        const pointer = getNavigatePointerPosition();
        if (!pointer) {
            return;
        }

        openAnimationCleanupRef.current?.();
        openAnimationCleanupRef.current = null;

        openAnimationCleanupRef.current = startOpenAnimation(pointer, () => isClosingRef.current);

        return () => {
            openAnimationCleanupRef.current?.();
            openAnimationCleanupRef.current = null;
        };
    }, [internalOpened]);

    return (
        <Modal
            opened={internalOpened}
            {...modalProps}
            transitionProps={
                isMobile() ? MOBILE_MODAL_PROPS.transitionProps : mergedTransitionProps
            }
            classNames={{
                inner: '!items-end lg:!items-center',
                content: 'modal-default',
                overlay: 'modal-overlay',
            }}
            {...props}
        />
    );
}
