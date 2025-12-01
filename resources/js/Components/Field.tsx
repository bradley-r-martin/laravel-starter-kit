import useFormContext from '@/Hooks/useFormContext';
import merge from 'merge-props';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
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
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const eventTargetRef = useRef<HTMLElement | null>(null);
    
    // Trigger submit after state update completes (on next render)
    useEffect(() => {
        if (pendingSubmit && eventTargetRef.current) {
            const formElement = eventTargetRef.current.closest('form') as HTMLFormElement | null;
            if (formElement) {
                const formEvent = {
                    preventDefault: () => {},
                    currentTarget: formElement,
                    target: formElement,
                } as unknown as React.FormEvent<HTMLFormElement>;
                submit(formEvent);
            }
            setPendingSubmit(false);
            eventTargetRef.current = null;
        }
    }, [pendingSubmit, submit]);
    
    const triggerSubmit = (event: React.SyntheticEvent<HTMLElement>) => {
        if (live) {
            eventTargetRef.current = event.target as HTMLElement;
            setPendingSubmit(true);
        }
    };
    
    return (
        <Slot
            children={children}
            {...merge(restProps, {
                value: inertiaFormInstance.data[name],

                onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                    triggerSubmit(event);
                },
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    switch (type) {
                        case 'file':
                            inertiaFormInstance.setData(name, e as unknown as Domain.File);
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
                        triggerSubmit(e);
                    }
                },
                error: inertiaFormInstance.errors[name],
            })}
        />
    );
};

export default Field;
