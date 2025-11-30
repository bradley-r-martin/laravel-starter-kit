export function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

export function isDesktop() {
    return !isIOS() && !isAndroid();
}

export function isStandalone() {
    return false;
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean })?.standalone === true
    );
}

export function isMobile() {
    return isIOS() || isAndroid();
}
