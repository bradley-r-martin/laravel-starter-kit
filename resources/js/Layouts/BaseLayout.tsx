import type { FunctionComponent, ReactNode } from 'react';

import { router } from '@inertiajs/react';
import { Button } from '@mantine/core';
import { FileBadgeIcon, FileLockIcon, FileQuestionIcon } from 'lucide-react';
import AssetBustingLayout from './AssetBustingLayout';
import RequiresInstallationLayout from './RequiresInstallationLayout';
import WithToastsLayout from './WithToastsLayout';

interface BaseLayoutProps {
    children: ReactNode;
    hideCopyright?: boolean;
    hideLinks?: boolean;
}

const BaseLayout: FunctionComponent<BaseLayoutProps> = (props) => {
    const { children, hideCopyright, hideLinks } = props;
    return (
        <AssetBustingLayout>
            <RequiresInstallationLayout>
                <WithToastsLayout>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute left-1/2 -mt-64 -ml-80 hidden transform-gpu opacity-30 blur-3xl lg:block">
                            <div
                                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-yellow-500 to-blue-500"
                                style={{
                                    clipPath:
                                        'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex min-h-screen w-full flex-col items-center">
                        <div className="container flex min-h-full max-w-7xl flex-1 flex-col">
                            {children}
                        </div>

                        <div className="container mt-10 mb-5 flex max-w-7xl flex-col justify-between space-y-4 space-y-reverse px-5 uppercase empty:hidden lg:mt-0 lg:flex-row lg:items-center lg:space-y-0">
                            {!hideCopyright && (
                                <div className="order-2 text-center text-xs text-slate-500 lg:order-1">
                                    &copy; stacks of snacks 2025
                                </div>
                            )}
                            {!hideLinks && (
                                <div className="order-1 grid grid-cols-2 items-center gap-px rounded bg-slate-200 ring-1 ring-slate-200 ring-offset-1 *:!bg-white lg:order-2 lg:flex lg:space-x-4 lg:bg-transparent lg:ring-0 lg:*:!bg-transparent">
                                    <Button
                                        variant="transparent"
                                        color="gray"
                                        onClick={() => router.visit('/terms-of-service')}
                                        leftSection={<FileBadgeIcon className="size-4" />}
                                        className="!rounded-r-none !rounded-b-none focus:z-10 lg:!rounded-md"
                                        size="xs"
                                        radius="sm"
                                    >
                                        Terms of service
                                    </Button>

                                    <Button
                                        variant="transparent"
                                        color="gray"
                                        onClick={() => router.visit('/privacy-policy')}
                                        leftSection={<FileLockIcon className="size-4" />}
                                        className="!rounded-l-none !rounded-b-none focus:z-10 lg:!rounded-md"
                                        size="xs"
                                        radius="sm"
                                    >
                                        Privacy policy
                                    </Button>
                                    <Button
                                        variant="transparent"
                                        color="gray"
                                        onClick={() => router.visit('/support')}
                                        leftSection={<FileQuestionIcon className="size-4" />}
                                        className="col-span-2 !rounded-t-none lg:!rounded-md"
                                        size="xs"
                                        radius="sm"
                                    >
                                        Support
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </WithToastsLayout>
            </RequiresInstallationLayout>
        </AssetBustingLayout>
    );
};

export default BaseLayout;
