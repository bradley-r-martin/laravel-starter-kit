import Tabbar from '@/components/Tabbar/Tabbar';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'motion/react';
import { FunctionComponent, useRef } from 'react';

interface MobileLayoutProps {
    children: React.ReactNode;
}

const MobileLayout: FunctionComponent<MobileLayoutProps> = (props) => {
    const { children } = props;

    const [opened, { toggle }] = useDisclosure(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
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
                    opened
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

            <Tabbar opened={opened}  toggle={toggle} close={close} />
        </div>
    );
};

export default MobileLayout;
