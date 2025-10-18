import { FunctionComponent } from "react";

interface ModalBodyProps {
    children: React.ReactNode;
}
 
const ModalBody: FunctionComponent<ModalBodyProps> = (props) => {
    return ( <div className='p-5 flex-1 h-full overflow-auto'>{props.children}</div>);
}
 
export default ModalBody;