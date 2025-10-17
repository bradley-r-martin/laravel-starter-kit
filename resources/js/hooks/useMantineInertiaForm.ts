import { FormDataConvertible, Method } from '@inertiajs/core';
import { useForm as useInertiaForm } from '@inertiajs/react';
import { createFormContext } from '@mantine/form';

export const [FormProvider, useFormContext, useForm] =
    createFormContext<Record<string, FormDataConvertible>>();

export function useMantineInertiaForm(
    action: { url: string; method: Method },
    initialValues: Record<string, FormDataConvertible>
) {
    const form = useForm({ initialValues });
    const inertiaForm = useInertiaForm<Record<string, any>>(initialValues);

    const handleSubmit = (values: typeof form.values) => {
        form.setSubmitting(true);

        // Only send dirty fields to the server
        const dirtyFields = form.getDirty();
        const dirtyValues = Object.fromEntries(
            Object.entries(values).filter(([key]) => dirtyFields[key])
        );

        inertiaForm.transform(() => dirtyValues);

        inertiaForm.submit(action, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                Object.entries(errors).forEach(([field, error]) => {
                    form.setFieldError(field, error);
                });
            },
            onFinish: () => form.setSubmitting(false),
        });
    };

    return { form, onSubmit: form.onSubmit(handleSubmit) };
}
