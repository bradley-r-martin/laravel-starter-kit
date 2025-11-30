export function Asset(file: Domain.File | null) {
    if (!file) return null;
    return `/storage/${file.path.replace(/^\/+/, '')}`;
}
