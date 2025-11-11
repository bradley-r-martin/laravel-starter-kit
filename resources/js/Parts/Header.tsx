import useContentContext from '@/Hooks/useContentContext';
import { isMobile } from '@/Utilities/Environment';
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
    const paddingBottom = useTransform(scrollY, [0, margin], [20, 2]);
    const paddingTop = useTransform(scrollY, [0, margin], [0, 0]);

    const backgroundColor = useTransform(
        scrollY,
        [0, margin],
        ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']
    );

    return (
        <>
            <motion.div
                className="relative z-20 container mx-auto translate-y-3 lg:px-4 lg:pt-10"
                style={
                    isMobile()
                        ? {
                              paddingLeft: paddingX,
                              paddingRight: paddingX,
                          }
                        : {}
                }
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
                    style={
                        isMobile()
                            ? {
                                  paddingBottom: paddingBottom,
                                  paddingLeft: paddingX,
                                  paddingRight: paddingX,
                              }
                            : {
                                  paddingBottom: paddingBottom,
                              }
                    }
                    className="flex items-center justify-between pt-2 lg:px-4"
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

                <HeaderFilters position={scrollY}>{filters}</HeaderFilters>
            </motion.div>
        </>
    );
};

export default Header;
