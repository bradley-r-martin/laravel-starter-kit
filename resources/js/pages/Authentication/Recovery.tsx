import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, Container, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { FunctionComponent } from 'react';

interface RecoveryProps {}

const Recovery: FunctionComponent<RecoveryProps> = () => {
    const form = useForm({
        email: '',
    });

    const { processing } = form;

    return (
        <MainLayout>
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
                                    <Field name="email" form={form}>
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
                                </Stack>
                            </Form>
                        </FormErrorSound>
                    </Paper>
                </Stack>
            </Container>
        </MainLayout>
    );
};

export default Recovery;
