import { HeadlessModal } from '@inertiaui/modal-react';
import { ActionIcon, Button, Modal as MantineModal, ModalProps as MantineModalProps } from '@mantine/core';
import { XIcon } from 'lucide-react';
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
                    transitionProps={{
                        transition: 'pop',
                        duration: 250, // faster
                        timingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', // more bounce
                    }}
                    classNames={{
                        overlay: '!bg-zinc-400/30 !backdrop-blur-[1px]',
                        inner: '!items-end lg:!items-center',
                        content: 'modal-default',
                    }}
                    centered={false}
                    opened={isOpen}
                    onClose={close}
                    onExitTransitionEnd={afterLeave}
                    {...props}
                >
                    <div className='group absolute top-5 right-5 flex items-center justify-center'>
                        <div className='absolute rounded-full size-6 group-hover:scale-200 transition-transform duration-300 ease-in-out bg-zinc-500/20'></div>
                    <ActionIcon onClick={close} variant="transparent" color="zinc" radius="xl" className='!bg-white'>
                        <XIcon className='size-5' />
                    </ActionIcon> 
                    </div>
                    {children}
                </MantineModal>
            )}
        </HeadlessModal>
    );
};

export default Modal;
