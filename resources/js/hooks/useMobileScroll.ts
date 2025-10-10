import { useEffect, useRef } from 'react';

/**
 * Custom hook that captures scroll and swipe gestures on the body
 * and transfers them to a specific scrollable element for smooth mobile scrolling.
 * 
 * This is particularly useful for iOS/Android where body scrolling can be janky
 * or where you want all scroll behavior contained within a specific element.
 * 
 * @returns A ref to attach to your scrollable element
 */
export function useMobileScroll<T extends HTMLElement>() {
    const scrollRef = useRef<T>(null);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        // Prevent body scrolling and enable only the specific element to scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        // Touch event handling for mobile swipe gestures
        let touchStartY = 0;
        let touchStartX = 0;
        let isScrolling = false;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isScrolling = false;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!scrollElement) return;

            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = touchStartY - touchY;
            const deltaX = touchStartX - touchX;

            // Determine if it's a vertical scroll (not horizontal)
            if (!isScrolling) {
                isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
            }

            if (isScrolling) {
                // Check if we're at the boundaries
                const isAtTop = scrollElement.scrollTop === 0 && deltaY < 0;
                const isAtBottom =
                    scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight + 1 &&
                    deltaY > 0;

                // Prevent default to stop body bounce, unless at boundaries and trying to scroll further
                if (!isAtTop && !isAtBottom) {
                    e.preventDefault();
                }

                scrollElement.scrollTop += deltaY;
                touchStartY = touchY;
                touchStartX = touchX;
            }
        };

        const handleTouchEnd = () => {
            isScrolling = false;
        };

        // Wheel event handling for desktop/trackpad scrolling
        const handleWheel = (e: WheelEvent) => {
            if (!scrollElement) return;

            // Check if we're at the boundaries
            const isAtTop = scrollElement.scrollTop === 0 && e.deltaY < 0;
            const isAtBottom =
                scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight + 1 &&
                e.deltaY > 0;

            // Prevent default to stop body scroll, unless at boundaries
            if (!isAtTop && !isAtBottom) {
                e.preventDefault();
            }

            scrollElement.scrollTop += e.deltaY;
        };

        // Attach event listeners with passive: false to allow preventDefault
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        document.addEventListener('wheel', handleWheel, { passive: false });

        // Cleanup function
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';

            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return scrollRef;
}

