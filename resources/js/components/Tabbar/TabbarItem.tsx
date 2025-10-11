import { motion, Transition } from 'motion/react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TabbarItemProps {
    icon: ReactNode;
    label: string;
    opened: boolean;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    children?: ReactNode;
}

const TabbarItem = (props: TabbarItemProps) => {

const {
    icon,
    label,
    opened,
    active = false,
    onClick,
    className = '',
    children,
    ...restProps
} = props


    const menu_item = opened
        ? { opacity: 1, y: 0, height: 'auto' }
        : { opacity: 0, y: 10, height: 0 };

    const transition: Transition = {
        ease: [0.785, 0.135, 0.15, 0.86],
    };

    const item_class =
        'data-[active=true]:text-blue-600 bg-white active:bg-zinc-100 active:shadow-inner select-none active:*:scale-95 overflow-hidden text-zinc-600 gap-1 flex flex-col items-center justify-center p-3 py-5';

    return (
        <motion.button
            className={twMerge(item_class, className)}
            onClick={onClick}
            data-opened={opened}
            {...restProps}
        >
            {icon}
            <motion.span animate={menu_item} transition={transition} className='text-xs'>
                {label}
            </motion.span>
            {children}
        </motion.button>
    );
};

export default TabbarItem;
