import { usePage } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import merge from 'merge-props';
import { FunctionComponent, useMemo } from 'react';
import Slot from '../Slot';

interface DataProps {
    children: React.ReactNode;
    property?: string;
    parameter: string;
    map?: (value: any) => any;
    fallback?: any;
}

const Data: FunctionComponent<DataProps> = (props) => {
    const { children, parameter, fallback, map, property = 'data', ...restProps } = props;
    const page = usePage();
    const modal = useModal();
    
    const data = useMemo(() => {
        return modal?.props?.[parameter] || (page.props[parameter] as unknown as any[]) || [];
    }, [modal?.props, parameter, page.props]);
    
    const mergedProps = useMemo(() => {
        return merge(restProps, {
            [property]: data ? data.map(map ?? ((value: any) => value)) : fallback,
        });
    }, [restProps, property, data, map, fallback]);

    return <Slot {...mergedProps}>{children}</Slot>;
};

export default Data;
