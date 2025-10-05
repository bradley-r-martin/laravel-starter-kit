import useFormContext from '@/hooks/useFormContext';
import merge from 'merge-props';
import React, { FunctionComponent } from 'react';
import Slot from './Slot';

interface FieldProps {
    type?: 'text' | 'number' | 'password' | 'email' | 'checkbox' | 'radio' | 'select' | 'textarea';
    name: string;
    children: React.ReactNode;
}

const Field: FunctionComponent<FieldProps> = (props) => {
    const { name, children, type, ...restProps } = props;
    const { inertiaFormInstance } = useFormContext();
    return (
        <Slot
            children={children}
            {...merge(restProps, {
                value: inertiaFormInstance.data[name],
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (typeof e === 'object' && 'target' in e) {
                        if (type === 'checkbox') {
                            inertiaFormInstance.setData(name, e.target.checked);
                        } else {
                            inertiaFormInstance.setData(name, e.target.value);
                        }
                    } else {
                        inertiaFormInstance.setData(name, e);
                    }
                },
                error: inertiaFormInstance.errors[name],
            })}
        />
    );
};

export default Field;
