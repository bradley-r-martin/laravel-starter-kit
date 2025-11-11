import merge from 'merge-props';
import React, { FunctionComponent } from 'react';

interface SlotProps {
    children: React.ReactNode;
    [key: string]: any;
}

const Slot: FunctionComponent<SlotProps> = (props) => {
    const { children, ...restProps } = props;
    return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, merge(restProps, child.props as Record<string, any>));
        }
        return child;
    });
};

export default Slot;
