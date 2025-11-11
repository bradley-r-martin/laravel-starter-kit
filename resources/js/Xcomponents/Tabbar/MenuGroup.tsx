import { motion, Transition } from 'motion/react';
import { FunctionComponent, ReactNode } from 'react';

interface MenuGroupProps {
    opened: boolean;
    children: ReactNode;
}

const MenuGroup: FunctionComponent<MenuGroupProps> = (props) => {
    const { opened, children } = props;
    const transition: Transition = {
        ease: [0.785, 0.135, 0.15, 0.86],
    };
    return (
        <motion.div
            animate={opened ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={transition}
            className="col-span-full flex overflow-hidden"
        >
            <div className="grid w-full flex-1 grid-cols-3 gap-px">{children}</div>
        </motion.div>
    );
};

export default MenuGroup;
