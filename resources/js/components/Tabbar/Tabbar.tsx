import { Avatar } from '@mantine/core';
import {
    BellIcon,
    BuildingIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    FilesIcon,
    GaugeIcon,
    GitPullRequestIcon,
    LogOutIcon,
    QrCodeIcon,
    Radar,
    ReceiptIcon,
    SettingsIcon,
    TruckIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FunctionComponent } from 'react';

interface TabbarProps {
    opened: boolean;
    toggle: () => void;
}

const Tabbar: FunctionComponent<TabbarProps> = (props) => {
    const { opened, toggle } = props;

    const menu_item = opened
        ? { opacity: 1, y: 0, height: 'auto' }
        : { opacity: 0, y: 10, height: 0 };

    const transition = {
        ease: [0.785, 0.135, 0.15, 0.86],
    };

    const item_class =
        'data-[active=true]:text-blue-600 bg-white active:bg-zinc-100 active:shadow-inner select-none active:*:scale-95 overflow-hidden text-zinc-600 text-xs gap-1 flex flex-col items-center justify-center p-3 py-5';

    return (
        <AnimatePresence initial={false}>
            <motion.div
                transition={transition}
                animate={
                    opened
                        ? {
                              backgroundColor: 'rgba(0,0,0,0.2)',
                          }
                        : {
                              backgroundColor: 'rgba(0,0,0,0)',
                          }
                }
                data-opened={opened}
                className="pointer-events-none fixed inset-0 flex h-full w-full flex-1 flex-col items-end justify-end data-[opened=true]:pointer-events-auto"
            >
                <motion.div
                    animate={
                        opened
                            ? {
                                  opacity: 100,
                                  y: 0,
                              }
                            : {
                                  opacity: 0,
                                  y: 10,
                              }
                    }
                    transition={transition}
                    className="mx-auto mb-4 flex h-2 w-1/3 rounded-full bg-zinc-950/50"
                />

                <motion.div
                    animate={{
                        borderTopLeftRadius: opened ? 20 : 0,
                        borderTopRightRadius: opened ? 20 : 0,
                        backgroundColor: opened ? 'rgba(244,244,245,1)' : 'rgba(255,255,255,1)',
                    }}
                    transition={transition}
                    data-opened={opened}
                    className="pointer-events-auto grid w-full grid-cols-3 gap-px overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
                >
                    <motion.div className={item_class} data-active={true}>
                        <Radar className="size-7" />
                        <motion.span animate={menu_item} transition={transition}>
                            Nearby
                        </motion.span>
                    </motion.div>
                    <motion.div
                        onClick={toggle}
                        data-opened={opened}
                        className={item_class + ' data-[opened=true]:text-rose-600'}
                    >
                        <div className="relative" onClick={toggle} data-active={opened}>
                            {/* <TouchTarget /> */}

                            <svg
                                viewBox="22 25 56 50"
                                className={`ham size-7`}
                                data-active={opened}
                            >
                                <path
                                    className="line top"
                                    d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
                                />
                                <path className="line" d="m 70,50 h -40" />
                                <path
                                    className="line bottom"
                                    d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
                                />
                            </svg>
                        </div>

                        <motion.span animate={menu_item} transition={transition}>
                            Close
                        </motion.span>
                    </motion.div>

                    <motion.div className={item_class}>
                        <BellIcon className="size-7" />
                        <motion.span animate={menu_item} transition={transition}>
                            Notifications
                        </motion.span>
                    </motion.div>

                    <motion.div
                        transition={transition}
                        animate={
                            opened
                                ? {
                                      height: 'auto',
                                  }
                                : { height: 0 }
                        }
                        className="col-span-3 overflow-hidden"
                    >
                        <div className="grid w-full flex-1 grid-cols-3 gap-px">
                            <motion.div className={item_class}>
                                <GaugeIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    Dashboard
                                </motion.span>
                            </motion.div>

                            <motion.div className={item_class}>
                                <BuildingIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    Sites
                                </motion.span>
                            </motion.div>
                            <motion.div className={item_class}>
                                <TruckIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    Routes
                                </motion.span>
                            </motion.div>

                            <motion.div className={item_class}>
                                <GitPullRequestIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    Runs
                                </motion.span>
                            </motion.div>

                            <motion.div className={item_class}>
                                <ReceiptIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    Expenses
                                </motion.span>
                            </motion.div>

                            <motion.div className={item_class}>
                                <QrCodeIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    QR Codes
                                </motion.span>
                            </motion.div>

                            <motion.div className={item_class}>
                                <FilesIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    Reports
                                </motion.span>
                            </motion.div>

                            <motion.div className={item_class + ' relative'}>
                                <SettingsIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    Manage
                                </motion.span>
                                <ChevronDownIcon className="absolute bottom-2 size-3" />
                            </motion.div>

                            <motion.div className={item_class}>
                                <LogOutIcon className="size-7 shrink-0" />
                                <motion.span animate={menu_item} transition={transition}>
                                    Logout
                                </motion.span>
                            </motion.div>

                            <motion.div className="col-span-full flex gap-1 overflow-hidden text-xs text-zinc-600">
                                <div className="flex flex-1 items-center gap-3 bg-white p-5 select-none active:bg-zinc-100 active:shadow-inner active:*:scale-95">
                                    <Avatar color="initials" name="John Doe" />
                                    <div className="flex flex-1 flex-col">
                                        <span className="font-medium">John Doe</span>
                                        <span className="text-zinc-500">john.doe@example.com</span>
                                    </div>
                                    <ChevronRightIcon className="size-5" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Tabbar;
