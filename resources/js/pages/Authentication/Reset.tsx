import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import MainLayout from '@/Layouts/MainLayout';
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
import { FunctionComponent } from 'react';

interface ResetProps {
    token: string;
    email: string;
}

const Reset: FunctionComponent<ResetProps> = ({ token, email }) => {
    const form = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const { processing } = form;

    return (
        <MainLayout>
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
        </MainLayout>
    );
};

export default Reset;
