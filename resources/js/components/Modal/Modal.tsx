import { HeadlessModal } from '@inertiaui/modal-react';
import { Modal as MantineModal, ModalProps as MantineModalProps } from '@mantine/core';
import { FunctionComponent, useRef } from 'react';

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
                <MantineModal
                    opened={isOpen}
                    onClose={close}
                    onExitTransitionEnd={afterLeave}
                    {...props}
                >
                    {children}
                </MantineModal>
            )}
        </HeadlessModal>
    );
};

export default Modal;
