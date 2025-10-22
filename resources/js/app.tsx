import { createInertiaApp } from '@inertiajs/react';
import { initFromPageProps, ModalRoot, ModalStackProvider } from '@inertiaui/modal-react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import MantineServiceProvider from './Providers/MantineServiceProvider';
import iosPwaNavigationLockService from './Services/IosPwaNavigationLockService';
import { isStandalone } from './Utilities/Environment';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

if (isStandalone()) {
    iosPwaNavigationLockService.activate();
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        initFromPageProps(props);

        const root = createRoot(el);
        root.render(
            <ModalStackProvider>
                <MantineServiceProvider>
                    <App {...props}>
                        {({ component: Component, key, props: pageProps }) => {
                            const child = createElement(Component, { key, ...pageProps });

                            if (Array.isArray(Component?.layout)) {
                                const layouts = [...Component.layout]
                                    .reverse()
                                    .reduce(
                                        (children, Layout) =>
                                            createElement(Layout, pageProps as any, children),
                                        child
                                    );
                                return (
                                    <>
                                        {layouts}
                                        <ModalRoot />
                                    </>
                                );
                            }

                            return (
                                <>
                                    {child}
                                    <ModalRoot />
                                </>
                            );
                        }}
                    </App>
                </MantineServiceProvider>
            </ModalStackProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
