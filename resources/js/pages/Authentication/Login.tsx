import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import BaseLayout from '@/Layouts/BaseLayout';
import { InertiaView } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Button,
    Container,
    Divider,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { KeyRoundIcon } from 'lucide-react';

interface LoginProps {}

const Login: InertiaView<LoginProps> = () => {
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
                                    <Field name="email">
                                        <TextInput
                                            label="Email"
                                            name="email"
                                            type="text"
                                            autoComplete="email"
                                            autoFocus
                                        />
                                    </Field>
                                    <Field name="password">
                                        <PasswordInput
                                            label="Password"
                                            name="password"
                                            autoComplete="current-password"
                                        />
                                    </Field>
                                    <Link href={route('recovery')}>Forgot password?</Link>

                                    <Button type="submit" loading={processing}>
                                        Sign in
                                    </Button>
                                    <Divider label="or" labelPosition="center" />
                                    <Button
                                        type="button"
                                        variant="default"
                                        leftSection={
                                            <KeyRoundIcon className="size-5 stroke-[1.5]" />
                                        }
                                    >
                                        Sign-in with Passkey
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

Login.layout = [BaseLayout];

export default Login;
