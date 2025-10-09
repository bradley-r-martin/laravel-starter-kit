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
                
                animate={{height: opened ? 'auto' : 0}}
                className={twMerge(
                    'flex-1 divide-y divide-zinc-950/10 lg:divide-none overflow-hidden lg:overflow-visible items-center justify-start gap-3 lg:flex row-start-2 col-span-full',
                    className
                )}
                {...restProps}
            />
           
        </>
    );
};

export default NavbarItems;
