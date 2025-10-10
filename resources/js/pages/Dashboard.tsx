import Tabbar from '@/components/Tabbar/Tabbar';
import { Head } from '@inertiajs/react';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'motion/react';
import { FunctionComponent } from 'react';

interface DashboardProps {}

const Dashboard: FunctionComponent<DashboardProps> = () => {
    const [opened, { toggle }] = useDisclosure(false);
    return (
        <>
            <Head title="Dashboard" />
          
            <div className="fixed inset-0 flex flex-col items-stretch bg-black">
                <motion.div
                    style={{ 
                        transformOrigin: 'center bottom',
                        paddingTop: 'calc(env(safe-area-inset-top) + 0.625rem)',
                        borderRadius: '40px',
                     }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    animate={
                        opened
                            ? { scale: 0.9, rotateX: 5, y: -30, filter: 'brightness(0.9)' }
                            : { scale: 1, rotateX: 0, y: 0, filter: 'brightness(1)' }
                    }
                    className="flex-1 overflow-auto bg-zinc-100 p-5 pb-20"
                >
                    <h1 className="text-2xl font-bold">Dashboard</h1>
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
                </motion.div>

                <Tabbar opened={opened} toggle={toggle} />
            </div>
        </>
    );
};

export default Dashboard;
