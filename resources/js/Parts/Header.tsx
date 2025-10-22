import useContentContext from '@/hooks/useContentContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { FunctionComponent, useRef } from 'react';
import HeaderFilters from './HeaderFilters';

interface HeaderProps {
    title?: React.ReactNode;
    action?: React.ReactNode;
    filters?: React.ReactNode;
    subtitle?: React.ReactNode;
}

const Header: FunctionComponent<HeaderProps> = ({ title, action, filters, subtitle }) => {
    const headerRef = useRef<HTMLDivElement>(null);
    const { ref: scrollContainerRef } = useContentContext();

    // Track scroll progress from the specific scroll container
    const { scrollY } = useScroll({
        container: scrollContainerRef,
    });

    // Transform scroll values to CSS properties
    // Animate over the first 100px of scroll
    const margin = 20;
    const fontSize = useTransform(scrollY, [0, margin], ['24px', '16px']);

    const scale = useTransform(scrollY, [0, margin], [1, 0.8]);

    const borderColor = useTransform(
        scrollY,
        [0, margin],
        ['rgba(224,224,224,0)', 'rgba(224,224,224,1)']
    );

    const paddingX = useTransform(scrollY, [0, margin], ['20px', '10px']);
    const paddingBottom = useTransform(scrollY, [0, margin], [20, 8]);
    const paddingTop = useTransform(scrollY, [0, margin], [0, 0]);
    const opacity = useTransform(scrollY, [0, margin], [1, 0]);

    const backgroundColor = useTransform(
        scrollY,
        [0, margin],
        ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']
    );

    return (
        <>
            <motion.div
                className="relative z-20 container mx-auto translate-y-3"
                style={{
                    paddingLeft: paddingX,
                    paddingRight: paddingX,
                    opacity: opacity,
                }}
            >
                {subtitle}
            </motion.div>
            <motion.div
                ref={headerRef}
                style={{
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    borderBottomColor: borderColor,

                    backgroundColor: backgroundColor,
                    paddingTop: paddingTop,
                }}
                className="sticky top-0 z-10 container mx-auto"
            >
                <motion.div
                    style={{
                        paddingBottom: paddingBottom,
                        paddingLeft: paddingX,
                        paddingRight: paddingX,
                    }}
                    className="flex items-center justify-between pt-2"
                >
                    <motion.h1
                        style={{
                            fontSize,
                        }}
                        className="font-bold text-zinc-950/80"
                    >
                        {title}
                    </motion.h1>

                    <motion.div style={{ scale, transformOrigin: 'right' }}>{action}</motion.div>
                </motion.div>

                {/* <div className='border-b border-zinc-950/20 py-2 px-5'>
                <input type="text" placeholder='Search' className='p-2 w-full bg-zinc-200 rounded' />
            </div> */}

                <HeaderFilters position={scrollY}>{filters}</HeaderFilters>
            </motion.div>
        </>
    );
};

export default Header;
