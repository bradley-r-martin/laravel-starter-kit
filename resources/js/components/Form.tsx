import FormContext from '@/contexts/FormContext';
import { InertiaFormProps, usePage } from '@inertiajs/react';
import { FunctionComponent, HTMLAttributes } from 'react';

interface FormProps
    extends Omit<HTMLAttributes<HTMLFormElement>, 'action' | 'onSubmit' | 'onError'> {
    onError?: (errors: Record<string, string>) => void;
    onSuccess?: () => void;
    form: InertiaFormProps<any>;
    action?: {
        url: string;
        method: 'post' | 'get' | 'put' | 'delete' | 'patch';
    };
}

const Form: FunctionComponent<FormProps> = (props) => {
    const { form, children, action, onError, onSuccess, ...restProps } = props;
    const page = usePage();
    const inertiaUiModal = (page.props as Record<string, unknown>)?._inertiaui_modal as
        | undefined
        | { baseUrl?: string };
    const extraHeaders = inertiaUiModal?.baseUrl
        ? { 'X-InertiaUI-Modal-Base-Url': inertiaUiModal.baseUrl }
        : undefined;

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // const dirtyFields = form.
        // const dirtyValues = Object.fromEntries(Object.entries(values).filter(([key]) => dirtyFields[key]));

        // inertiaForm.transform(() => dirtyValues);

        if (action) {
            form.submit(
                {
                    method: action.method,
                    url: action.url,
                },
                {
                    headers: extraHeaders,
                    onError: (errors) => {
                        onError?.(errors);
                    },
                    onSuccess: () => {
                        onSuccess?.();
                    },
                }
            );
        }
    };

    return (
        <FormContext.Provider value={{ inertiaFormInstance: form }}>
            <form method="post" onSubmit={onSubmit} {...restProps}>
                {children}
            </form>
        </FormContext.Provider>
    );
};

export default Form;
