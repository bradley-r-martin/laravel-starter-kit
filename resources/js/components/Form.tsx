import FormContext from '@/contexts/FormContext';
import { InertiaFormProps } from '@inertiajs/react';
import { FunctionComponent, HTMLAttributes } from 'react';

interface FormProps
    extends Omit<HTMLAttributes<HTMLFormElement>, 'action' | 'onSubmit' | 'onError'> {
    onError?: (errors: Record<string, string>) => void;
    form: InertiaFormProps<any>;
    action?: {
        url: string;
        method: 'post' | 'get' | 'put' | 'delete' | 'patch';
    };
}

const Form: FunctionComponent<FormProps> = (props) => {
    const { form, children, action, onError, ...restProps } = props;

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (action) {
            form.submit(
                {
                    method: action.method,
                    url: action.url,
                },
                {
                    onError: (errors) => {
                        onError?.(errors);
                    },
                }
            );
        }
    };

    return (
        <FormContext.Provider value={{ inertiaFormInstance: form }}>
            <form onSubmit={onSubmit} {...restProps}>
                {children}
            </form>
        </FormContext.Provider>
    );
};

export default Form;
