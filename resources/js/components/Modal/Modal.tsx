import { HeadlessModal } from '@inertiaui/modal-react';
import { ActionIcon, ModalProps as MantineModalProps } from '@mantine/core';
import { XIcon } from 'lucide-react';
import { FunctionComponent, useRef } from 'react';
import { AnimatedModal } from './AnimatedModal';

interface ModalProps extends Omit<MantineModalProps, 'opened' | 'onClose'> {
    children: React.ReactNode;
}

interface HeadlessModalRenderProps {
    isOpen: boolean;
    close: () => void;
    afterLeave: () => void;
    config: Record<string, unknown>;
    emit: (event: string, ...args: unknown[]) => void;
    getChildModal: () => unknown;
    getParentModal: () => unknown;
    id: string;
    index: number;
    modalContext: unknown;
    onTopOfStack: boolean;
    reload: (options?: Record<string, unknown>) => void;
    setOpen: (value: boolean) => void;
}

const Modal: FunctionComponent<ModalProps> = ({ children, ...props }) => {
    const modalRef = useRef<any>(null);

    return (
        <HeadlessModal ref={modalRef}>
            {({ isOpen, close, afterLeave }: HeadlessModalRenderProps) => (
                <AnimatedModal
                    animateOnMount
                    centered={false}
                    opened={isOpen}
                    onClose={close}
                    onExitTransitionEnd={afterLeave}
                    {...props}
                >
                    <div className="group absolute top-5 right-5 flex items-center justify-center">
                        <div className="absolute size-6 rounded-full bg-zinc-500/20 transition-transform duration-300 ease-in-out group-hover:scale-200"></div>
                        <ActionIcon
                            onClick={close}
                            variant="transparent"
                            color="zinc"
                            radius="xl"
                            className="!bg-white"
                        >
                            <XIcon className="size-5" />
                        </ActionIcon>
                    </div>
                    {children}
                </AnimatedModal>
            )}
        </HeadlessModal>
    );
};

export default Modal;
