type PointerPosition = {
    x: number;
    y: number;
};

let lastPointerPosition: PointerPosition | null = null;

const listeners = new Set<(position: PointerPosition | null) => void>();

export function setNavigatePointerPosition(position: PointerPosition) {
    lastPointerPosition = position;
    for (const listener of listeners) {
        listener(lastPointerPosition);
    }
}

export function getNavigatePointerPosition() {
    return lastPointerPosition;
}

export function subscribeNavigatePointerPosition(
    listener: (position: PointerPosition | null) => void
) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
