import useContentContext from '@/hooks/useContentContext';
import AppLayout from '@/Layouts/AppLayout';
import BaseLayout from '@/Layouts/BaseLayout';
import Header from '@/Parts/Header';
import { InertiaView } from '@/types';
import { Head } from '@inertiajs/react';

interface DashboardProps {}

const Dashboard: InertiaView<DashboardProps> = () => {
    const { ref } = useContentContext();
    return (
        <>
            <Head title="Dashboard" />

            <Header scrollContainerRef={ref} title="Dashboard" />
            <div className="p-5">
        
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

Dashboard.layout = [BaseLayout, AppLayout];

export default Dashboard;
