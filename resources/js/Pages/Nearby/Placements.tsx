import NearbyNoPlacementsFoundView from '@/Features/Nearby/Views/NearbyNoPlacementsFoundView';
import useLocation from '@/Hooks/useLocation';
import AppLayout from '@/Layouts/AppLayout';
import Header from '@/Parts/Header';
import { InertiaView } from '@/Types';
import { router } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { useModalStack } from '@inertiaui/modal-react';
import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { MapPinnedIcon, QrCodeIcon } from 'lucide-react';

import { useEffect, useState } from 'react';

interface NearbyProps {}

const Nearby: InertiaView<NearbyProps> = () => {
    const [scannerOpened, scannerControls] = useDisclosure(false);
    const modalStack = useModalStack();

    const { props: { nearby } } = usePage<{
        nearby: Models.Site[];
    }>();

    const { latitude, longitude, requestPermission, status } = useLocation();

    useEffect(() => {
            requestPermission();
    }, []);

    useEffect(() => {
        if (latitude && longitude && status === 'watching') {
            router.reload({only: ['nearby'], data: {latitude, longitude}});
        }
    },[latitude, longitude]);

    const [data, setData] = useState<IDetectedBarcode[] | null>(null);

    return (
        <div className="flex h-full w-full flex-col">
          
     
            {status === 'requesting' && (
              <span>Requesting Permission</span>
            )}
            {status === 'unauthorised' && (
              <span>Unauthorised</span>
            )}
            {status === 'error' && (
              <span>Error</span>
            )}
            {status === 'unsupported' && (
              <span>Unsupported</span>
            )}
            {status === 'watching' && (
              <span>
                {nearby && <div className='flex flex-col '>
                    <Header
                title="Nearby placements"
                
            />
                    {nearby?.map((site) => (
                        <div key={site.id} onClick={()=>  modalStack.visitModal('/nearby/placement')}>
                            <span>{site.name}</span>
                        </div>
                    ))}
                    <div className='flex flex-col items-center justify-center gap-2 bottom-24 inset-x-5 absolute'>
                        <Button
                            variant="filled"
                            color="zinc"
                            size="md"
                            leftSection={<QrCodeIcon className="size-4" />}
                            onClick={() => {
                                scannerControls.open();
                            }}
                            fullWidth
                        >
                            Scan QR Code
                        </Button>
                        <div className="text-xs text-zinc-500">Scan to load a machine that doesn't appear nearby</div>
                        </div>
                    </div>}
                {nearby?.length === 0 && (
                     <NearbyNoPlacementsFoundView  />

                )}
              </span>
            )}

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
                            onScan={() => {
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

Nearby.layout = [AppLayout];

export default Nearby;
