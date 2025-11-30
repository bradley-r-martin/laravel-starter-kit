import { usePage } from '@inertiajs/react';
import { Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    BellIcon,
    Building2Icon,
    BuildingIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    FilesIcon,
    GaugeIcon,
    GitPullRequestIcon,
    LogOutIcon,
    LollipopIcon,
    MapIcon,
    PackageIcon,
    PuzzleIcon,
    QrCodeIcon,
    Radar,
    ReceiptIcon,
    RowsIcon,
    SettingsIcon,
    ShieldIcon,
    TruckIcon,
    UsersIcon,
    WarehouseIcon,
} from 'lucide-react';
import { AnimatePresence, motion, Transition, useDragControls } from 'motion/react';
import { FunctionComponent } from 'react';
import MenuGroup from './MenuGroup';
import TabbarHandle from './TabbarHandle';
import TabbarItem from './TabbarItem';

interface TabbarProps {
    opened: boolean;
    toggle: () => void;
    close: () => void;
}

const Tabbar: FunctionComponent<TabbarProps> = (props) => {
    const { opened, toggle, close } = props;
    const { component } = usePage<{ component: string }>();
    const dragControls = useDragControls();

    function onClose() {
        close();
        manageControls.close();
    }

    const [manageOpened, manageControls] = useDisclosure(false);

    const transition: Transition = {
        ease: [0.785, 0.135, 0.15, 0.86],
    };

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
                onPointerDown={(e) => {
                    if (opened) {
                        dragControls.start(e);
                    }
                }}
                className="pointer-events-none fixed inset-0 flex flex-1 flex-col items-end justify-end data-[opened=true]:pointer-events-auto"
            >
                <motion.div
                    drag={opened ? 'y' : false}
                    dragControls={dragControls}
                    dragListener={false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }}
                    onDragEnd={(_, info) => {
                        // Close if dragged down more than 100px or velocity is high enough
                        if (info.offset.y > 100 || info.velocity.y > 500) {
                            toggle();
                        }
                    }}
                    className="pointer-events-none relative flex w-full flex-col items-center"
                >
                    <TabbarHandle opened={opened} />

                    <motion.div
                        id="menu"
                        style={{
                            paddingBottom: 'calc(env(safe-area-inset-bottom) - 20px)',
                        }}
                        animate={{
                            borderTopLeftRadius: opened ? 20 : 0,
                            borderTopRightRadius: opened ? 20 : 0,
                            y: 0,
                        }}
                        transition={transition}
                        data-opened={opened}
                        className="pointer-events-auto w-full overflow-hidden bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
                    >
                        <motion.div
                            animate={{
                                backgroundColor: opened
                                    ? 'rgba(244,244,245,1)'
                                    : 'rgba(255,255,255,1)',
                            }}
                            transition={transition}
                            data-opened={opened}
                            className="pointer-events-auto grid w-full grid-cols-3 gap-px overflow-hidden"
                        >
                            <TabbarItem
                                icon={<Radar className="size-7" />}
                                label="Nearby"
                                opened={opened}
                                href="/nearby"
                                onClose={onClose}
                                data-active={component.startsWith('Nearby')}
                            />
                            <TabbarItem
                                icon={
                                    <div className="icon relative" data-opened={opened}>
                                        <svg
                                            viewBox="22 25 56 50"
                                            className="ham size-7"
                                            data-opened={opened}
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
                                }
                                label="Close"
                                opened={opened}
                                onClick={opened ? onClose : toggle}
                                data-active={component.startsWith('Dashboard')}
                                className="data-[opened=true]:*:text-rose-600"
                            />

                            <TabbarItem
                                icon={<BellIcon className="size-7" />}
                                label="Notifications"
                                opened={opened}
                                onClose={onClose}
                                href="/notifications"
                                data-active={component.startsWith('Notification')}
                            />

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
                                <MenuGroup opened={!manageOpened}>
                                    <TabbarItem
                                        icon={<GaugeIcon className="size-7 shrink-0" />}
                                        label="Dashboard"
                                        opened={opened}
                                        href="/dashboard"
                                        onClose={onClose}
                                        data-active={component.startsWith('Dashboard')}
                                    />

                                    <TabbarItem
                                        icon={<BuildingIcon className="size-7 shrink-0" />}
                                        label="Sites"
                                        opened={opened}
                                        onClose={onClose}
                                        href="/sites"
                                        data-active={component.startsWith('Site')}
                                    />

                                    <TabbarItem
                                        icon={<TruckIcon className="size-7 shrink-0" />}
                                        label="Routes"
                                        opened={opened}
                                        onClose={onClose}
                                        href="/routes"
                                        data-active={component.startsWith('Route')}
                                    />

                                    <TabbarItem
                                        icon={<GitPullRequestIcon className="size-7 shrink-0" />}
                                        label="Runs"
                                        opened={opened}
                                        onClose={onClose}
                                        href="/runs"
                                        data-active={component.startsWith('Run')}
                                    />

                                    <TabbarItem
                                        icon={<ReceiptIcon className="size-7 shrink-0" />}
                                        label="Expenses"
                                        opened={opened}
                                        onClose={onClose}
                                        href="/expenses"
                                        data-active={component.startsWith('Expense')}
                                    />

                                    <TabbarItem
                                        icon={<QrCodeIcon className="size-7 shrink-0" />}
                                        label="QR Codes"
                                        opened={opened}
                                        onClose={onClose}
                                        href="/qr-codes"
                                        data-active={component.startsWith('QRCode')}
                                    />

                                    <TabbarItem
                                        icon={<FilesIcon className="size-7 shrink-0" />}
                                        label="Reports"
                                        opened={opened}
                                        onClose={onClose}
                                        href="/reports"
                                        data-active={component.startsWith('Reports')}
                                    />

                                    <TabbarItem
                                        icon={<SettingsIcon className="size-7 shrink-0" />}
                                        label="Manage"
                                        opened={opened}
                                        onClose={() => {}}
                                        className="relative"
                                        onClick={() => manageControls.toggle()}
                                    >
                                        <ChevronDownIcon className="absolute bottom-2 size-3" />
                                    </TabbarItem>

                                    <TabbarItem
                                        icon={<LogOutIcon className="size-7 shrink-0" />}
                                        label="Logout"
                                        href={'/logout'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                </MenuGroup>

                                <MenuGroup opened={manageOpened}>
                                    <TabbarItem
                                        icon={<LollipopIcon className="size-7 shrink-0" />}
                                        label="Snackwares"
                                        href={'/snackwares'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                    <TabbarItem
                                        icon={<PackageIcon className="size-7 shrink-0" />}
                                        label="Products"
                                        href={'/products'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                    <TabbarItem
                                        icon={<RowsIcon className="size-7 shrink-0" />}
                                        label="Product Types"
                                        href={'/product-types'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                    <TabbarItem
                                        icon={<Building2Icon className="size-7 shrink-0" />}
                                        label="Manufacturers"
                                        href={'/manufacturers'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                    <TabbarItem
                                        icon={<WarehouseIcon className="size-7 shrink-0" />}
                                        label="Wholesalers"
                                        href={'/wholesalers'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                    <TabbarItem
                                        icon={<ShieldIcon className="size-7 shrink-0" />}
                                        label="Roles"
                                        href={'/roles'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                    <TabbarItem
                                        icon={<UsersIcon className="size-7 shrink-0" />}
                                        label="Users"
                                        href={'/users'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                    <TabbarItem
                                        icon={<MapIcon className="size-7 shrink-0" />}
                                        label="Territories"
                                        href={'/territories'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                    <TabbarItem
                                        icon={<PuzzleIcon className="size-7 shrink-0" />}
                                        label="Operators"
                                        href={'/operators'}
                                        opened={opened}
                                        onClose={onClose}
                                    />
                                </MenuGroup>

                                <motion.div className="col-span-full flex gap-1 overflow-hidden text-xs text-zinc-600">
                                    <div className="flex flex-1 items-center gap-3 bg-white p-5 select-none active:bg-zinc-100 active:shadow-inner active:*:scale-95">
                                        <Avatar color="initials" name="John Doe" />
                                        <div className="flex flex-1 flex-col">
                                            <span className="font-medium">John Doe</span>
                                            <span className="text-zinc-500">
                                                john.doe@example.com
                                            </span>
                                        </div>
                                        <ChevronRightIcon className="size-5" />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Tabbar;
