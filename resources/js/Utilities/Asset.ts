export function Asset(path: string | null) {
    if (!path) return null;
    return `/storage/${path.replace(/^\/+/, '')}`;
}
