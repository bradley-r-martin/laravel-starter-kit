import RequiresInstallationLayout from '@/Layouts/RequiresInstallationLayout';
import { PageProps } from '@/Types';
import { Head } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    return (
        <RequiresInstallationLayout>
            <Head title="Welcome" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Laravel</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        {auth?.user
                            ? `Hello, ${auth.user.name}!`
                            : 'Get started by editing resources/js/pages/Welcome.tsx'}
                    </p>
                </div>
            </div>
        </RequiresInstallationLayout>
    );
}
