
import { InertiaFormProps } from '@inertiajs/react';
import { createContext } from 'react';

type FormContextType<Data extends Record<string, any>> = {
    inertiaFormInstance: InertiaFormProps<Data>;
};

const FormContext = createContext<FormContextType<any> | undefined>(undefined);

export default FormContext;
