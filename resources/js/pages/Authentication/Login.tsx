import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Head, useForm } from '@inertiajs/react';
import {
    Button,
    Container,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { FunctionComponent } from 'react';

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
    const form = useForm({
        email: '',
        password: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title="Login" />
            <Container size="xs" py="xl" h="100vh">
                <Stack gap="xl">
                    <Stack gap="xs">
                        <Title order={1}>Login</Title>
                        <Text size="sm" c="dimmed">
                            Sign in to your account to continue
                        </Text>
                    </Stack>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <FormErrorSound>
                            <Form
                                form={form}
                                action={{ url: route('login.process'), method: 'post' }}
                            >
                                <Stack gap="md">
                                    <Field name="email" form={form}>
                                        <TextInput
                                            label="Email"
                                            type="text"
                                            autoComplete="email"
                                            autoFocus
                                            required
                                        />
                                    </Field>
                                    <Field name="password" form={form}>
                                        <PasswordInput
                                            label="Password"
                                            autoComplete="current-password"
                                            required
                                        />
                                    </Field>

                                    <Group justify="flex-end" mt="md">
                                        <Button type="submit" loading={processing}>
                                            Sign in
                                        </Button>
                                    </Group>
                                </Stack>
                            </Form>
                        </FormErrorSound>
                    </Paper>
                </Stack>
            </Container>
        </>
    );
};

export default Login;
