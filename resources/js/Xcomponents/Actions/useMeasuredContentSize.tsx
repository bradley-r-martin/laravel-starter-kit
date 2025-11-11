import React, { useLayoutEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { innerBaseClasses, outerBaseClasses } from './styles';

export interface Size {
    width: number;
    height: number;
}

export function useMeasuredContentSize(children: React.ReactNode, className?: string) {
    const measureOuterRef = useRef<HTMLDivElement | null>(null);
    const measureInnerRef = useRef<HTMLDivElement | null>(null);
    const [targetSize, setTargetSize] = useState<Size | null>(null);
    const [shouldRenderMeasureNode, setShouldRenderMeasureNode] = useState(true);

    useLayoutEffect(() => {
        const inner = measureInnerRef.current;
        if (!inner) return;

        const innerWidth = Math.ceil(inner.offsetWidth);
        const innerHeight = Math.ceil(inner.offsetHeight);

        const borderAdjustment = 2; // 1px left + 1px right
        const widthFudge = 4; // prevent subpixel clipping of right padding

        setTargetSize({
            width: innerWidth + borderAdjustment + widthFudge,
            height: innerHeight + borderAdjustment,
        });

        // Remove the measure node after measuring
        setShouldRenderMeasureNode(false);
    }, [children]);

    const measureNode = shouldRenderMeasureNode ? (
        <div
            ref={measureOuterRef}
            className={twMerge(outerBaseClasses, className)}
            style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
            aria-hidden="true"
        >
            <div
                ref={measureInnerRef}
                className={innerBaseClasses}
                style={{ whiteSpace: 'nowrap' }}
            >
                {children}
            </div>
        </div>
    ) : null;

    return { targetSize, measureNode } as const;
}
