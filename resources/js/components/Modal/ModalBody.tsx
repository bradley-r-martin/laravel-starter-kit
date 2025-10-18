import { FunctionComponent } from 'react';

interface ModalBodyProps {
    children: React.ReactNode;
}

const ModalBody: FunctionComponent<ModalBodyProps> = (props) => {
    return <div className="h-full flex-1 overflow-auto p-5">{props.children}</div>;
};

export default ModalBody;
