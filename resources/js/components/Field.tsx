import { InertiaFormProps } from '@inertiajs/react';
import merge from 'merge-props';
import React, { FunctionComponent } from 'react';
import Slot from './Slot';

interface FieldProps {
    form: InertiaFormProps<any>; // to be replaced by a context.
    name: string;
    children: React.ReactNode;
}

const Field: FunctionComponent<FieldProps> = (props) => {
    const { name, children, form, ...restProps } = props;
    return (
        <Slot
            children={children}
            {...merge(restProps, {
                value: form.data[name],
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    form.setData(name, e.target.value),
                error: form.errors[name],
            })}
        />
    );
};

export default Field;
