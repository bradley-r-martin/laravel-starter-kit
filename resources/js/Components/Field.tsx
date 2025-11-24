import useFormContext from '@/Hooks/useFormContext';
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
    live?: boolean;
    name: string;
    children: React.ReactNode;
}

const Field: FunctionComponent<FieldProps> = (props) => {
    const { name, children, type = 'text', live = false, ...restProps } = props;
    const { inertiaFormInstance, submit } = useFormContext();
    return (
        <Slot
            children={children}
            {...merge(restProps, {
                value: inertiaFormInstance.data[name],

                onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                    if (live) {
                        submit(event);
                        // if (event.target.value !== inertiaFormInstance.data[name]) {
                        // Find the closest form and submit
                        const formElement = event.target.closest('form');
                        if (formElement) {
                            formElement.requestSubmit();
                        }
                        // }
                    }
                },
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
                    if (live && type === 'select') {
                        submit(e);
                    }
                },
                error: inertiaFormInstance.errors[name],
            })}
        />
    );
};

export default Field;
