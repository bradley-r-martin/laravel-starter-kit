import Navbar from '@/components/Navbar';
import { User } from '@/types/inertia';
import { Link, usePage } from '@inertiajs/react';
import { Avatar, Indicator, Menu } from '@mantine/core';
import {
    BuildingIcon,
    ChevronDownIcon,
    CogIcon,
    FactoryIcon,
    FilesIcon,
    GaugeIcon,
    GitPullRequestIcon,
    InboxIcon,
    KeyIcon,
    LogOutIcon,
    LollipopIcon,
    MessageCircleQuestionIcon,
    PackageIcon,
    PresentationIcon,
    PuzzleIcon,
    QrCodeIcon,
    ReceiptIcon,
    RefreshCcwIcon,
    RowsIcon,
    ShieldIcon,
    TruckIcon,
    UserCircleIcon,
    UsersIcon,
    WarehouseIcon,
} from 'lucide-react';
import { FunctionComponent } from 'react';

interface NavigationProps {}

const Navigation: FunctionComponent<NavigationProps> = () => {
    const { component, props } = usePage<{ component: string; user: User }>();
    const { user } = props;
    return (
        <header className="relative">
            <Navbar>
                <Navbar.Hamburger />
                <Navbar.Item className="flex-1 md:flex-none">
                    <Navbar.Item.Link href="/" px={4} variant="transparent">
                        <Navbar.Brand />
                    </Navbar.Item.Link>
                </Navbar.Item>
                <Navbar.Divider />
                <Navbar.Items>
                    <Navbar.Item>
                        <Navbar.Item.Indicator active={component.startsWith('Dashboard')} />
                        <Navbar.Item.Link
                            href={'/dashboard'}
                            leftSection={<GaugeIcon className="size-5" />}
                        >
                            Dashboard
                        </Navbar.Item.Link>
                    </Navbar.Item>
                    <Navbar.Item>
                        <Navbar.Item.Indicator active={component.startsWith('Site')} />
                        <Navbar.Item.Link
                            href={'/sites'}
                            leftSection={<BuildingIcon className="size-5" />}
                        >
                            Sites
                        </Navbar.Item.Link>
                    </Navbar.Item>
                    <Navbar.Item>
                        <Navbar.Item.Indicator active={component.startsWith('Route')} />
                        <Navbar.Item.Link
                            href={'/routes'}
                            leftSection={<TruckIcon className="size-5" />}
                        >
                            Routes
                        </Navbar.Item.Link>
                    </Navbar.Item>
                    <Navbar.Item>
                        <Navbar.Item.Indicator active={component.startsWith('Run')} />
                        <Navbar.Item.Link
                            href={'/runs'}
                            leftSection={<GitPullRequestIcon className="size-5" />}
                        >
                            Runs
                        </Navbar.Item.Link>
                    </Navbar.Item>
                    <Navbar.Item>
                        <Navbar.Item.Indicator active={component.startsWith('Expense')} />
                        <Navbar.Item.Link
                            href={'/'}
                            leftSection={<ReceiptIcon className="size-5" />}
                        >
                            Expenses
                        </Navbar.Item.Link>
                    </Navbar.Item>
                    <Navbar.Item>
                        <Navbar.Item.Indicator active={component.startsWith('QRCode')} />
                        <Navbar.Item.Link
                            href={'/qr-codes'}
                            leftSection={<QrCodeIcon className="size-5" />}
                        >
                            QR Codes
                        </Navbar.Item.Link>
                    </Navbar.Item>
                    <Navbar.Item>
                        <Navbar.Item.Indicator active={component.startsWith('Reports')} />
                        <Navbar.Item.Link
                            href={'/reports'}
                            leftSection={<FilesIcon className="size-5" />}
                        >
                            Reports
                        </Navbar.Item.Link>
                    </Navbar.Item>

                    <Menu
                        withOverlay
                        overlayProps={{
                            opacity: 0,
                        }}
                        shadow="md"
                        width={250}
                        arrowSize={12}
                        arrowOffset={18}
                        withArrow
                        offset={0}
                        position="bottom-start"
                    >
                        <Menu.Target>
                            <Navbar.Item>
                                <Navbar.Item.Indicator
                                    active={
                                        component.startsWith('Products') ||
                                        component.startsWith('ProductType') ||
                                        component.startsWith('Manufacturer') ||
                                        component.startsWith('Snackware') ||
                                        component.startsWith('Wholesaler') ||
                                        component.startsWith('Operator') ||
                                        component.startsWith('Territorie') ||
                                        component.startsWith('User') ||
                                        component.startsWith('Role')
                                    }
                                />
                                <Navbar.Item.Button
                                    leftSection={<CogIcon className="size-5" />}
                                    rightSection={<ChevronDownIcon className="size-3" />}
                                >
                                    Manage
                                </Navbar.Item.Button>
                            </Navbar.Item>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                className="data-[active=true]:!bg-zinc-950/8"
                                data-active={!!component.startsWith('Snackware')}
                                component={Link}
                                href={'/snackwares'}
                                leftSection={<LollipopIcon className="size-4" />}
                            >
                                Snackwares
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                className="data-[active=true]:!bg-zinc-950/8"
                                data-active={!!component.startsWith('Product/')}
                                component={Link}
                                href={'/products'}
                                leftSection={<PackageIcon className="size-4" />}
                            >
                                Products
                            </Menu.Item>
                            <Menu.Item
                                className="data-[active=true]:!bg-zinc-950/8"
                                data-active={!!component.startsWith('ProductType')}
                                component={Link}
                                href={'/product-types'}
                                leftSection={<RowsIcon className="size-4" />}
                            >
                                Product types
                            </Menu.Item>

                            <Menu.Item
                                className="data-[active=true]:!bg-zinc-950/8"
                                data-active={!!component.startsWith('Manufacturer')}
                                component={Link}
                                href={'/manufacturers'}
                                leftSection={<FactoryIcon className="size-4" />}
                            >
                                Manufacturers
                            </Menu.Item>

                            <Menu.Item
                                className="data-[active=true]:!bg-zinc-950/8"
                                data-active={!!component.startsWith('Wholesaler')}
                                component={Link}
                                href={'/wholesalers'}
                                leftSection={<WarehouseIcon className="size-4" />}
                            >
                                Wholesalers
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                className="data-[active=true]:!bg-zinc-950/8"
                                data-active={!!component.startsWith('Territory')}
                                component={Link}
                                href={'/territories'}
                                leftSection={<PresentationIcon className="size-4" />}
                            >
                                Territories
                            </Menu.Item>
                            <Menu.Item
                                className="data-[active=true]:!bg-zinc-950/8"
                                data-active={!!component.startsWith('Operator')}
                                component={Link}
                                href={'/operators'}
                                leftSection={<PuzzleIcon className="size-4" />}
                            >
                                Operators
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                className="data-[active=true]:!bg-zinc-950/8"
                                data-active={!!component.startsWith('User')}
                                component={Link}
                                href={'/users'}
                                leftSection={<UsersIcon className="size-4" />}
                            >
                                Users
                            </Menu.Item>

                            <Menu.Item
                                component={Link}
                                href={'/roles'}
                                data-active={!!component.startsWith('Role')}
                                leftSection={<ShieldIcon className="size-4" />}
                            >
                                Roles
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Navbar.Items>
                <div className="hidden flex-1 lg:block"></div>

                <Menu
                    withOverlay
                    overlayProps={{
                        opacity: 0,
                    }}
                    shadow="md"
                    width={250}
                    arrowSize={12}
                    arrowOffset={18}
                    withArrow
                    offset={0}
                    position="bottom"
                >
                    <Menu.Target>
                        <Navbar.Item className="row-start-1">
                            <Navbar.Item.Indicator />
                            <Navbar.Item.Button px={8}>
                                <Indicator
                                    withBorder
                                    position="top-center"
                                    processing
                                    offset={3}
                                    color="red"
                                >
                                    <InboxIcon className="size-6 lg:size-5" />
                                </Indicator>
                            </Navbar.Item.Button>
                        </Navbar.Item>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item leftSection={<MessageCircleQuestionIcon className="size-4" />}>
                            Support Centre
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Navbar.Divider />
                <Menu
                    withOverlay
                    overlayProps={{
                        opacity: 0,
                    }}
                    shadow="md"
                    width={250}
                    arrowSize={12}
                    arrowOffset={18}
                    withArrow
                    offset={0}
                    position="bottom-end"
                >
                    <Menu.Target>
                        <Navbar.Item className="row-start-1">
                            <Navbar.Item.Indicator />
                            <Navbar.Item.Button
                                leftSection={
                                    <Avatar
                                        size="sm"
                                        name={`${user?.first_name} ${user?.last_name}`}
                                        color="initials"
                                        className="border border-zinc-200 bg-zinc-100 shadow-2xl"
                                    />
                                }
                                rightSection={
                                    <ChevronDownIcon className="hidden size-3 lg:block" />
                                }
                            >
                                <span className="hidden flex-col items-start lg:flex">
                                    {user?.first_name} {user?.last_name}
                                </span>
                            </Navbar.Item.Button>
                        </Navbar.Item>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            className="data-[active=true]:!bg-zinc-950/8"
                            data-active={!!component.startsWith('Snackware')}
                            component={Link}
                            href={'/snackwares'}
                            leftSection={<MessageCircleQuestionIcon className="size-4" />}
                        >
                            Support Centre
                        </Menu.Item>

                        <Menu.Item
                            className="data-[active=true]:!bg-zinc-950/8"
                            leftSection={<KeyIcon className="size-4" />}
                            component={Link}
                            href={'/users/password/'}
                        >
                            Change password
                        </Menu.Item>
                        <Menu.Item
                            className="data-[active=true]:!bg-zinc-950/8"
                            leftSection={<UserCircleIcon className="size-4" />}
                            component={Link}
                            href={'/users/update/'}
                        >
                            Edit profile
                        </Menu.Item>
                        <Menu.Divider />

                        <Menu.Item
                            component={Link}
                            href={'/territories'}
                            className="data-[active=true]:!bg-zinc-950/8"
                            leftSection={<RefreshCcwIcon className="size-4" />}
                        >
                            Switch account
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            className="data-[active=true]:!bg-zinc-950/8"
                            leftSection={<LogOutIcon className="size-4" />}
                            component={Link}
                            href={'/logout'}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Navbar>
        </header>
    );
};

export default Navigation;
