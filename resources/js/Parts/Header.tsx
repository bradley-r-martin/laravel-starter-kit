import { motion, useScroll, useTransform } from 'motion/react';
import { FunctionComponent, RefObject, useRef } from 'react';

interface HeaderProps {
    title?: React.ReactNode;
    action?: React.ReactNode;
    scrollContainerRef: RefObject<HTMLDivElement | null>;
}

const Header: FunctionComponent<HeaderProps> = ({ scrollContainerRef, title, action }) => {
    const headerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress from the specific scroll container
    const { scrollY } = useScroll({
        container: scrollContainerRef,
    });

    // Transform scroll values to CSS properties
    // Animate over the first 100px of scroll
    const margin = 20;
    const fontSize = useTransform(scrollY, [0, margin], ['24px', '16px']);

    const scale = useTransform(scrollY, [0, margin], [1, 0.8]);

    const borderColor = useTransform(scrollY, [0, margin], ['transparent', '#e0e0e0']);

    return (
        <motion.div
            ref={headerRef}
            className="sticky top-0 z-10 container mx-auto bg-gradient-to-b from-zinc-100 via-zinc-100 to-zinc-100/50 lg:from-white lg:via-white lg:to-white/50"
        >
            <motion.div
                style={{
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    borderBottomColor: borderColor,
                }}
                className="flex items-center justify-between p-2 px-5"
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
        </motion.div>
    );
};

export default Header;
