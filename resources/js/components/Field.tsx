import useFormContext from '@/XHooks/useFormContext';
import merge from 'merge-props';
import React, { FunctionComponent } from 'react';
import Slot from './Slot';

interface FieldProps {
    type?:
        | 'text'
        | 'number'
        | 'password'
        | 'email'
        | 'checkbox'
        | 'radio'
        | 'select'
        | 'textarea'
        | 'file'
        | 'transfer'
        | 'phone'
        | 'address';
    name: string;
    children: React.ReactNode;
}

const Field: FunctionComponent<FieldProps> = (props) => {
    const { name, children, type = 'text', ...restProps } = props;
    const { inertiaFormInstance } = useFormContext();
    return (
        <Slot
            children={children}
            {...merge(restProps, {
                value: inertiaFormInstance.data[name],
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    switch (type) {
                        case 'file':
                            inertiaFormInstance.setData(name, e);
                            break;
                        case 'checkbox':
                        case 'radio':
                            inertiaFormInstance.setData(name, e.target.checked);
                            break;
                        case 'select':
                        case 'transfer':
                        case 'number':
                        case 'phone':
                        case 'address':
                            inertiaFormInstance.setData(name, e);
                            break;
                        case 'text':
                        case 'email':
                        case 'password':
                        case 'textarea':
                            inertiaFormInstance.setData(name, e.target.value);
                            break;
                        default:
                            inertiaFormInstance.setData(name, e);
                            break;
                    }
                },
                error: inertiaFormInstance.errors[name],
            })}
        />
    );
};

export default Field;
