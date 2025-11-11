import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import BaseLayout from '@/Layouts/BaseLayout';
import { InertiaView } from '@/Types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Container, Paper, Stack, Text, TextInput, Title } from '@mantine/core';

interface RecoveryProps {}

const Recovery: InertiaView<RecoveryProps> = () => {
    const form = useForm({
        email: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title="Account Recovery" />
            <Container size="xs" py="xl" h="100vh">
                <Stack gap="xl">
                    <Stack gap="xs">
                        <Title order={1}>Account Recovery</Title>
                        <Text size="sm" c="dimmed">
                            Enter your email address to recover your account
                        </Text>
                    </Stack>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <FormErrorSound>
                            <Form
                                form={form}
                                action={{ url: route('recovery.process'), method: 'post' }}
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

                                    <Button type="submit" loading={processing}>
                                        Send Recovery Link
                                    </Button>
                                    <Link href={route('login')}>Back to login</Link>
                                </Stack>
                            </Form>
                        </FormErrorSound>
                    </Paper>
                </Stack>
            </Container>
        </>
    );
};

Recovery.layout = [BaseLayout];

export default Recovery;
