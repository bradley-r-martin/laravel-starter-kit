import Tabbar from '@/components/Tabbar/Tabbar';
import ContentContext from '@/contexts/ContentContext';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'motion/react';
import { FunctionComponent, useEffect, useRef } from 'react';
import { useModalStack } from '@inertiaui/modal-react';

interface MobileLayoutProps {
    children: React.ReactNode;
}

const MobileLayout: FunctionComponent<MobileLayoutProps> = (props) => {
    const { children } = props;

    const [opened, { toggle, close }] = useDisclosure(false);

    const [scale, controls] = useDisclosure(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const modalStack = useModalStack();

    useEffect(() => {
        console.log(modalStack);
       
        if ( modalStack.stack.find(m => m.isOpen)) {
            controls.open();
        }else{
            controls.close();
        }
    }, [modalStack]);

    return (
        <ContentContext.Provider value={{ 
            ref: scrollContainerRef as React.RefObject<HTMLDivElement>,
            opened: scale,
            open: controls.open,
            close: controls.close
        }}>
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
                    scale
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
                {children}
            </motion.div>

            <Tabbar opened={opened} toggle={()=>{
                toggle();
                controls.toggle();
            }} close={()=>{
                close();
                controls.close();
            }} />
        </div>
        </ContentContext.Provider>
    );
};

export default MobileLayout;
