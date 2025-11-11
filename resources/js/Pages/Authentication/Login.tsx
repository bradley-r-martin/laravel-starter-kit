import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import BaseLayout from '@/Layouts/BaseLayout';

import EntryLayout from '@/Layouts/EntryLayout';
import { InertiaView } from '@/XTypes';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Divider, PasswordInput, Stack, TextInput } from '@mantine/core';
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

            <Stack gap="xl" p="xl">
                <div className="select-none">
                    <h1 className="text-2xl font-bold text-zinc-950/70">Login</h1>
                    <p className="text-sm text-zinc-950/70">Sign in to your account to continue</p>
                </div>

                <FormErrorSound>
                    <Form form={form} action={{ url: route('login.process'), method: 'post' }}>
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
                                leftSection={<KeyRoundIcon className="size-5 stroke-[1.5]" />}
                            >
                                Sign-in with Passkey
                            </Button>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Stack>
        </>
    );
};

Login.layout = [BaseLayout, EntryLayout];

export default Login;
