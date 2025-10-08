import { Modal as InertiaModal } from '@inertiaui/modal-react';
import { FunctionComponent } from 'react';

interface ModalProps {
    children: React.ReactNode;
}

const Modal: FunctionComponent<ModalProps> = ({ children }) => {
    return <InertiaModal>{children}</InertiaModal>;
};

export default Modal;
