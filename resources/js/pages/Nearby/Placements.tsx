import NearbyNoPlacementsFoundView from '@/Features/Nearby/Views/NearbyNoPlacementsFoundView';
import MobileLayout from '@/Layouts/MobileLayout';
import RequiresInstallationLayout from '@/Layouts/RequiresInstallationLayout';
import { useModalStack } from '@inertiaui/modal-react';
import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

import { FunctionComponent, useState } from 'react';

interface NearbyProps {}

const Nearby: FunctionComponent<NearbyProps> = () => {
    const [scannerOpened, scannerControls] = useDisclosure(false);
    const modalStack = useModalStack();

    const [data, setData] = useState<IDetectedBarcode[] | null>(null);

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <NearbyNoPlacementsFoundView open={scannerControls.open} />
            <Drawer
                radius="xl"
                opened={scannerOpened}
                onClose={() => {
                    scannerControls.close();
                    setData(null);
                }}
                withCloseButton={false}
                position="bottom"
                padding={0}
                styles={{
                    content: {
                        backgroundColor: 'black',
                        height: 'auto',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        paddingBottom: 'calc(env(safe-area-inset-bottom))',
                    },
                }}
            >
                {/* Drawer content */}
                {!data && (
                    <div className="relative">
                        <div className="absolute inset-14 z-20">
                            <div className="absolute top-0 left-0 size-8 rounded-tl-lg border-t-4 border-l-4 border-white" />
                            <div className="absolute top-0 right-0 size-8 rotate-90 rounded-tl-lg border-t-4 border-l-4 border-white" />
                            <div className="absolute right-0 bottom-0 size-8 rotate-180 rounded-tl border-t-4 border-l-4 border-white" />
                            <div className="absolute bottom-0 left-0 size-8 -rotate-90 rounded-tl-lg border-t-4 border-l-4 border-white" />
                        </div>

                        <div
                            className="animate-scan absolute top-1/2 z-10 h-1/2 w-full -translate-y-1/2 border-t border-white bg-white/20"
                            style={{
                                maskImage:
                                    'radial-gradient(52.19% 100% at 50% 0%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 95.31%)',
                            }}
                        />
                        <Scanner
                            paused={!scannerOpened || !!data}
                            components={{
                                torch: false,
                                finder: false,
                            }}
                            onScan={(data) => {
                                scannerControls.close();
                                modalStack.visitModal('/nearby/placement');
                            }}
                        />
                    </div>
                )}

                <div className="flex items-center justify-center bg-black p-4">
                    <Button
                        onClick={() => {
                            scannerControls.close();
                            setData(null);
                        }}
                        variant="outline"
                        color="white"
                    >
                        Cancel
                    </Button>
                </div>
            </Drawer>
        </div>
    );
};

Nearby.layout = (component: React.ReactNode) => {
    return <RequiresInstallationLayout>
        <MobileLayout children={component} />
    </RequiresInstallationLayout>;
};

export default Nearby;
