import { InertiaFormProps } from '@inertiajs/react';
import { createContext } from 'react';

type FormContextType<Data extends Record<string, any>> = {
    inertiaFormInstance: InertiaFormProps<Data>;
    submit: (e: any) => void;
};

const FormContext = createContext<FormContextType<any> | undefined>(undefined);

export default FormContext;
