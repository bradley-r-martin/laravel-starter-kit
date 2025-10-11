import Tabbar from '@/components/Tabbar/Tabbar';
import Header from '@/Parts/Header';
import { Head } from '@inertiajs/react';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'motion/react';
import { FunctionComponent, useRef } from 'react';

interface DashboardProps {}

const Dashboard: FunctionComponent<DashboardProps> = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <Head title="Dashboard" />

            <div className="absolute inset-0 flex flex-col items-stretch bg-black">
                <motion.div
                    ref={scrollContainerRef}
                    id="main-content"
                    data-testid="main-content"
                    style={{
                        transformOrigin: 'center bottom',
                        paddingTop: 'calc(env(safe-area-inset-top))',
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    animate={
                        opened
                            ? {
                                  scale: 0.9,
                                  rotateX: 5,
                                  y: -30,
                                  filter: 'brightness(0.9)',
                                  borderTopLeftRadius: 30,
                                  borderTopRightRadius: 30,
                              }
                            : { scale: 1, rotateX: 0, y: 0, filter: 'brightness(1)' }
                    }
                    className="flex-1 overflow-auto bg-zinc-100"
                >
                    <Header scrollContainerRef={scrollContainerRef} />
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
                </motion.div>

                <Tabbar opened={opened} toggle={toggle} />
            </div>
        </>
    );
};

export default Dashboard;
