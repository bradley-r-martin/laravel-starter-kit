import BaseLayout from '@/Layouts/BaseLayout';
import EntryLayout from '@/Layouts/EntryLayout';
import { InertiaView } from '@/Types';
import { Head, Link } from '@inertiajs/react';
import { Button, Stack } from '@mantine/core';

interface LogoutProps {}

const Logout: InertiaView<LogoutProps> = () => {
    return (
        <>
            <Head title="Logged Out" />

            <Stack gap="xl" p="xl">
                <div className="select-none">
                    <h1 className="text-2xl font-bold text-zinc-950/70">Logged Out</h1>
                    <p className="text-sm text-zinc-950/70">
                        You have been successfully logged out of your account.
                    </p>
                </div>

                <Button component={Link} href={route('login')} variant="outline" color="zinc">
                    Return to Login
                </Button>
            </Stack>
        </>
    );
};

Logout.layout = [BaseLayout, EntryLayout];

export default Logout;
