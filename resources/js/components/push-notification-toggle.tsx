import usePushNotifications from '@/hooks/usePushNotifications';
import Prompt from '@/Parts/Prompt';
import { Button, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import ModalHeader from './ModalHeader';
import { BellIcon } from 'lucide-react';
import { AnimatedModal } from './Modal/AnimatedModal';
import useContentContext from '@/hooks/useContentContext';

export default function PushNotificationToggle() {
    const content = useContentContext();
    const [opened, { toggle, open, close }] = useDisclosure(false);
    const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();


    useEffect(() => {
        if(!isLoading && !isSubscribed){
            open();
            content.open();
        }
    }, [isLoading, isSubscribed]);
    

    if (!isSupported) {
        return null;
    }

    const handleToggle = async () => {
        try {
            if (isSubscribed) {
                await unsubscribe();
            } else {
                await subscribe();
            }
            close();
            content.close();
        } catch (error) {
            console.error('Error toggling push notifications:', error);
        }
    };


    return (


        <AnimatedModal withCloseButton={false} animateOnMount   opened={opened} onClose={()=>{
            close();
            content.close();
        }}>
            <ModalHeader title="Push Notifications" description="To send you notifications to your phone, we need to enable notification permission." icon={<BellIcon className="size-6" />} hero />
           <Stack gap="xl">
           <Prompt />
    <Stack gap="xs">
    <Button
            onClick={handleToggle}
            disabled={isLoading}
            variant={isSubscribed ? 'outline' : 'filled'}
        >
            {isLoading
                ? 'Loading...'
                : isSubscribed
                  ? 'Disable Notifications'
                  : 'Enable Notifications'}
        </Button>
    <Button variant="outline" size="sm" color="zinc" onClick={() => {
        close();
        content.close();
    }}>Skip</Button>
    </Stack>
           </Stack>
           </AnimatedModal>
        
    );
}
