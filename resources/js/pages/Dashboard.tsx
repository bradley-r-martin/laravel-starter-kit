import MobileLayout from '@/Layouts/MobileLayout';
import RequiresInstallationLayout from '@/Layouts/RequiresInstallationLayout';
import { Head } from '@inertiajs/react';
import { FunctionComponent } from 'react';

interface DashboardProps {}

const Dashboard: FunctionComponent<DashboardProps> = () => {
    return (
        <>
            <Head title="Dashboard" />

            {/* <Header scrollContainerRef={scrollContainerRef} /> */}
            <div className="p-5">
                <div>Dashboard</div>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
                <p className="text-zinc-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <br />
            </div>
        </>
    );
};

Dashboard.layout = (component: React.ReactNode) => {
    return <RequiresInstallationLayout>
        <MobileLayout children={component} />
    </RequiresInstallationLayout>;
};

export default Dashboard;
