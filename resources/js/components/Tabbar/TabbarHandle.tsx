import { motion, Transition } from 'motion/react';
import { FunctionComponent } from 'react';

interface TabbarHandleProps {
    opened: boolean;
}

const TabbarHandle: FunctionComponent<TabbarHandleProps> = (props) => {
    const { opened } = props;

    const transition: Transition = {
        ease: [0.785, 0.135, 0.15, 0.86],
    };

    return (
        <motion.div
            animate={
                opened
                    ? {
                          opacity: 100,
                          y: 0,
                      }
                    : {
                          opacity: 0,
                          y: 10,
                      }
            }
            transition={transition}
            className="mx-auto mb-4 flex h-2 w-1/3 rounded-full bg-zinc-950/50"
        />
    );
};

export default TabbarHandle;
