export * from './global';
export * from './inertia';

export interface Paginated<Record> {
    data: Record[];
    current_page: number;
    from: number;
    last_page: number;
    links: {
        first: string;
        last: string;
        next: string;
        prev: string;
    };
    path: string;
    per_page: number;
    to: number;
    total: number;
    status?: string;
}
