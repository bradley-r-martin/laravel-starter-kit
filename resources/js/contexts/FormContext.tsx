import { VisitOptions } from '@inertiajs/core';
import { createContext } from 'react';

type FormContextType = {
    action: {
        url: string;
        method: string;
    };
    headers: Omit<VisitOptions, 'data' | 'method'>;
    data: () => Record<string, any>;
    errors: () => Record<string, string>;
    submit: () => void;
    reset: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export default FormContext;
