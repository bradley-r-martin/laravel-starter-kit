import useNavbar from '@/hooks/useNavbar';
import { motion } from 'motion/react';
import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { MotionDivProps } from '../Actions/Actions';

const NavbarItems: FunctionComponent<MotionDivProps & HTMLAttributes<HTMLDivElement>> = (props) => {
    const { className, ...restProps } = props;
    const [opened] = useNavbar();

    return (
        <>
            <motion.div
                animate={{ height: opened ? 'auto' : 0 }}
                className={twMerge(
                    'col-span-full row-start-2 flex-1 items-center justify-start gap-3 divide-y divide-zinc-950/10 overflow-hidden lg:flex lg:divide-none lg:overflow-visible',
                    className
                )}
                {...restProps}
            />
        </>
    );
};

export default NavbarItems;
