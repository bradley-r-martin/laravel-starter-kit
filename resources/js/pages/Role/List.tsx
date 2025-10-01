import { Head, Link } from '@inertiajs/react';

export default function List() {
    return (
        <>
            <Head title="Roles" />
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
                        <Link
                            href={route('roles.create')}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                            Create Role
                        </Link>
                    </div>

                    <div className="rounded-lg bg-white p-8 shadow-md">
                        <p className="text-gray-600">Roles list will go here</p>
                    </div>
                </div>
            </div>
        </>
    );
}
