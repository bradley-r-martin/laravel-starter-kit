import { Select, SelectProps } from '@mantine/core';
import { forwardRef, useEffect, useRef } from 'react';

const AutoWidthSelect = forwardRef<HTMLInputElement, SelectProps>((props, ref) => {
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calculateWidth = () => {
            // Find the input element within the Select component
            const input = selectRef.current?.querySelector('input');
            if (!input) return;

            // Get the displayed value from the input
            const displayText = input.value || props.placeholder || '';

            // Get computed styles for accurate text measurement
            const styles = window.getComputedStyle(input);
            const fontSize = styles.fontSize;
            const fontFamily = styles.fontFamily;
            const fontWeight = styles.fontWeight;

            // Create canvas for measuring text
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;

            // Measure the text width
            const metrics = ctx.measureText(displayText);
            const textWidth = metrics.width;

            // Add padding for left/right padding, borders, and icon
            // Mantine Select has padding, plus the chevron icon needs space
            const totalWidth = Math.ceil(textWidth) + 60; // Balanced padding buffer

            selectRef.current!.style.width = `${totalWidth}px`;
        };

        // Find the input element
        const input = selectRef.current?.querySelector('input');
        if (!input) return;

        // Initial calculation
        calculateWidth();

        // Listen to input changes
        input.addEventListener('change', calculateWidth);
        input.addEventListener('input', calculateWidth);

        // Watch for value attribute changes
        const observer = new MutationObserver(calculateWidth);
        observer.observe(input, {
            attributes: true,
            attributeFilter: ['value'],
        });

        // Also watch parent for structural changes
        const parentObserver = new MutationObserver(calculateWidth);
        if (selectRef.current) {
            parentObserver.observe(selectRef.current, {
                subtree: true,
                childList: true,
                characterData: true,
            });
        }

        return () => {
            input.removeEventListener('change', calculateWidth);
            input.removeEventListener('input', calculateWidth);
            observer.disconnect();
            parentObserver.disconnect();
        };
    }, [props.placeholder]);

    return (
        <div ref={selectRef}>
            <Select {...props} ref={ref} />
        </div>
    );
});

AutoWidthSelect.displayName = 'AutoWidthSelect';

export default AutoWidthSelect;
