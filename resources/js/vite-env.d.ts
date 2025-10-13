/// <reference types="vite/client" />

declare module '@inertiaui/modal-react';

declare module '*.svg?react' {
    import { FunctionComponent, SVGProps } from 'react';
    const content: FunctionComponent<SVGProps<SVGSVGElement>>;
    export default content;
}
