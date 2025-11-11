import FormContext from '@/Contexts/FormContext';
import { InertiaFormProps, usePage } from '@inertiajs/react';
import { FunctionComponent, HTMLAttributes, useState } from 'react';

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
    const [original] = useState(form.data);
    const page = usePage();
    const inertiaUiModal = (page.props as Record<string, unknown>)?._inertiaui_modal as
        | undefined
        | { baseUrl?: string };
    const extraHeaders = inertiaUiModal?.baseUrl
        ? { 'X-InertiaUI-Modal-Base-Url': inertiaUiModal.baseUrl }
        : undefined;

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formElement = e.currentTarget;

        // Get all disabled and hidden input names from the form
        const disabledAndHiddenFields = Array.from(
            formElement.querySelectorAll('input[disabled], input[type="hidden"]')
        ).map((input) => (input as HTMLInputElement).name);

        const dirtyFieldNames = Object.keys(original).filter(
            (key) => form.data[key] !== original[key]
        );

        // Always include disabled and hidden fields along with dirty fields
        const fieldsToInclude = [...new Set([...dirtyFieldNames, ...disabledAndHiddenFields])];

        form.transform(() =>
            Object.fromEntries(
                Object.entries(form.data).filter(([key]) => fieldsToInclude.includes(key))
            )
        );

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
