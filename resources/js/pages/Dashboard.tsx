import { Head } from '@inertiajs/react';
import { FunctionComponent } from 'react';

interface DashboardProps {}

const Dashboard: FunctionComponent<DashboardProps> = () => {
    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Welcome to your dashboard
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-8 shadow-md">
                        <p className="text-gray-700">
                            You are now logged in and viewing the dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;

