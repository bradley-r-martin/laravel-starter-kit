import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import BaseLayout from '@/Layouts/BaseLayout';
import { InertiaView } from '@/XTypes';
import { Head, useForm } from '@inertiajs/react';
import {
    Button,
    Container,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

interface ResetProps {
    token: string;
    email: string;
}

const Reset: InertiaView<ResetProps> = ({ token, email }) => {
    const form = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title="Reset Password" />
            <Container size="xs" py="xl" h="100vh">
                <Stack gap="xl">
                    <Stack gap="xs">
                        <Title order={1}>Reset Password</Title>
                        <Text size="sm" c="dimmed">
                            Enter your new password below
                        </Text>
                    </Stack>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <FormErrorSound>
                            <Form
                                form={form}
                                action={{
                                    url: route('reset.process'),
                                    method: 'post',
                                }}
                            >
                                <Stack gap="md">
                                    <input type="hidden" name="token" value={form.data.token} />

                                    <Field name="email">
                                        <TextInput
                                            label="Email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            disabled
                                        />
                                    </Field>

                                    <Field name="password">
                                        <PasswordInput
                                            label="New Password"
                                            name="password"
                                            autoComplete="new-password"
                                            autoFocus
                                        />
                                    </Field>

                                    <Field name="password_confirmation">
                                        <PasswordInput
                                            label="Confirm Password"
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                        />
                                    </Field>

                                    <Button type="submit" loading={processing}>
                                        Reset Password
                                    </Button>
                                </Stack>
                            </Form>
                        </FormErrorSound>
                    </Paper>
                </Stack>
            </Container>
        </>
    );
};

Reset.layout = [BaseLayout];

export default Reset;
