
import MobileLayout from '@/Layouts/MobileLayout';
import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FunctionComponent, useState } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import ScanSound from '../../audio/Scan.wav';

interface NearbyProps {}

const Nearby: FunctionComponent<NearbyProps> = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const [data, setData] = useState<IDetectedBarcode[]| null>(null);
   return <div className='flex flex-col items-center justify-center h-full'>


    <div>No nearby placements detected</div>

    <Button onClick={toggle}>Scan QR Code</Button>
    <Drawer radius="xl" opened={opened} onClose={toggle} withCloseButton={false} position='bottom' padding={0} styles={{
       
        content:{
            height: 'auto',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        paddingBottom: 'calc(env(safe-area-inset-bottom))',
        }
    }}>
        {/* Drawer content */}
        {!data && <Scanner sound={new Audio(ScanSound).baseURI} onScan={(data) => {
            setData(data);

        }} />}
        {data && <div className='p-4'>{data.map((item) => (
            <div key={item.rawValue}>{item.rawValue}</div>
        ))}</div>}
            <div className='p-4 bg-black/70 absolute bottom-0 left-0 right-0 flex items-center justify-center'>
                <Button onClick={toggle} variant='outline' color="white">Cancel</Button>
            </div>
      </Drawer>


   </div>
};

Nearby.layout = (component: React.ReactNode) => {
    return <MobileLayout children={component} />;
};

export default Nearby;
