
import MobileLayout from '@/Layouts/MobileLayout';
import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FunctionComponent, useState } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

interface NearbyProps {}

const Nearby: FunctionComponent<NearbyProps> = () => {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [data, setData] = useState<IDetectedBarcode[]| null>(null);

    function onClose(){
        setData(null);
        close();
    }


   return <div className='flex flex-col items-center justify-center h-full'>


    <div>No nearby placements detected</div>

    <Button onClick={toggle}>Scan QR Code</Button>
    <Drawer radius="xl" opened={opened} onClose={onClose} withCloseButton={false} position='bottom' padding={0} styles={{
       
        content:{
            backgroundColor: 'black',
            height: 'auto',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        paddingBottom: 'calc(env(safe-area-inset-bottom))',
        }
    }}>
        {/* Drawer content */}
        {!data && <div className='relative'>

            <div className='absolute inset-14 z-20'>
            <div className="size-3 rounded-tl border-t-2 border-l-2 border-white absolute top-0 left-0" />
  <div className="size-3 rounded-tl border-t-2 border-l-2 border-white absolute top-0 right-0 rotate-90" />
  <div className="size-3 rounded-tl border-t-2 border-l-2 border-white absolute right-0 bottom-0 rotate-180" />
  <div className="size-3 rounded-tl border-t-2 border-l-2 border-white absolute bottom-0 left-0 -rotate-90" />
            
            </div>

    
            <div
                            className="animate-scan z-10 absolute top-1/2 -translate-y-1/2 h-1/2 w-full border-t border-white bg-white/20"
                            style={{
                                maskImage: 'radial-gradient(52.19% 100% at 50% 0%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 95.31%)',
                            }}
                        />
           <Scanner 
        
        components={{
            torch:false,
            finder:false,
        }}
        onScan={(data) => {
            setData(data);

        }} /></div>}
        {data && <div className='p-4'>{data.map((item) => (
            <div key={item.rawValue}>{item.rawValue}</div>
        ))}</div>}
            <div className='p-4 bg-black flex items-center justify-center'>
                <Button onClick={onClose} variant='outline' color="white">Cancel</Button>
            </div>
      </Drawer>


   </div>
};

Nearby.layout = (component: React.ReactNode) => {
    return <MobileLayout children={component} />;
};

export default Nearby;
