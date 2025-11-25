import { FunctionComponent } from 'react';

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    policies: string[];
};

declare type InertiaView<Props> = FunctionComponent<Props> & {
    layout?: any[];
};
