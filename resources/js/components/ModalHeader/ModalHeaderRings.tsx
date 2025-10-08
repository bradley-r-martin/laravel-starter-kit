import { motion } from 'motion/react';
import { FunctionComponent } from 'react';
import { twMerge } from 'tailwind-merge';

type ModalHeaderRingsProps = Omit<
    React.SVGProps<SVGSVGElement>,
    'width' | 'height' | 'viewBox' | 'fill'
> & {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
};

const ModalHeaderRings: FunctionComponent<ModalHeaderRingsProps> = ({
    width = 260,
    height = 260,
    viewBox = '0 0 336 336',
    className,
    ...restProps
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox={viewBox}
            fill="none"
            className={twMerge(
                className,
                'pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-200'
            )}
            {...restProps}
        >
            <mask
                id="mask0_4947_375931"
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={336}
                height={336}
                style={{ maskType: 'alpha' }}
            >
                <rect width={336} height={336} fill="url(#paint0_radial_4947_375931)" />
            </mask>
            <g mask="url(#mask0_4947_375931)">
                {/* Inner circle with fast pulse */}
                <motion.circle
                    cx={168}
                    cy={168}
                    r="47.5"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                />

                {/* Second circle with medium pulse and slight rotation */}
                <motion.circle
                    cx={168}
                    cy={168}
                    r="71.5"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1"
                    style={{
                        transformOrigin: '168px 168px',
                    }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.0, delay: 0.2, ease: 'easeInOut' }}
                />

                {/* Third circle with scale animation */}
                <motion.circle
                    cx={168}
                    cy={168}
                    r="95.5"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1"
                    style={{
                        transformOrigin: '168px 168px',
                    }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
                />

                {/* Fourth circle with delayed pulse */}
                <motion.circle
                    cx={168}
                    cy={168}
                    r="119.5"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.4, delay: 0.6, ease: 'easeInOut' }}
                />

                {/* Fifth circle with opacity wave */}
                <motion.circle
                    cx={168}
                    cy={168}
                    r="143.5"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.6, delay: 0.8, ease: 'easeInOut' }}
                />

                {/* Outer circle with gentle rotation */}
                <motion.circle
                    cx={168}
                    cy={168}
                    r="167.5"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1"
                    style={{
                        transformOrigin: '168px 168px',
                    }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, delay: 1.0, ease: 'easeInOut' }}
                />
            </g>
            <defs>
                <radialGradient
                    id="paint0_radial_4947_375931"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(168 168) rotate(90) scale(168 168)"
                >
                    <stop />
                    <stop offset={1} stopOpacity={0} />
                </radialGradient>
            </defs>
        </svg>
    );
};

export default ModalHeaderRings;
