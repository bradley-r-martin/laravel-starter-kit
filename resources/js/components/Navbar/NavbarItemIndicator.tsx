import { motion } from 'motion/react';
import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type MotionDivProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    | 'onDrag'
    | 'onDragEnd'
    | 'onDragStart'
    | 'onAnimationStart'
    | 'onAnimationEnd'
    | 'onAnimationIteration'
>;

const NavbarItemIndicator: FunctionComponent<MotionDivProps & { active?: boolean }> = (props) => {
    const { className, active, ...restProps } = props;
    if (active) {
        return (
            <motion.div
                layout
                layoutId="navbar-item-indicator"
                className={twMerge(
                    'absolute inset-x-2 -bottom-2.5 flex h-0.5 rounded-full bg-zinc-950/90',
                    className
                )}
                {...restProps}
            />
        );
    }
    return null;
};

export default NavbarItemIndicator;
