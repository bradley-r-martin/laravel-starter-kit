import { FunctionComponent } from "react";
import Slot from "../Slot";
import merge from "merge-props";
import { useModal } from "@inertiaui/modal-react";

interface DataProps {
    children: React.ReactNode;
    property?: string;
    parameter: string;
    map?: (value: any) => any;
    fallback?: any;
}
 
const Data: FunctionComponent<DataProps> = (props) => {
    const { children, parameter, fallback, map, property = 'data', ...restProps } = props;
    const data = useModal()?.props?.[parameter] as any[];
    const mergedProps = merge(restProps, {
        [property]: data
            ? data.map(map ?? ((value: any) => value))
            : fallback,
    });

    return <Slot {...mergedProps}>{children}</Slot>;
}
 
export default Data;




