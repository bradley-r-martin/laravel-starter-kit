/// <reference types="vite/client" />

import { AxiosInstance } from 'axios';

declare global {
    interface Window {
        axios: AxiosInstance;
        google: typeof google;
    }
    var route: typeof ziggyRoute;
}

declare module '*.svg?react' {
    import * as React from 'react';
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

export {};
