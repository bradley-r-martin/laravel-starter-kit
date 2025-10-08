import { createTheme, MantineProvider } from '@mantine/core';
import { FunctionComponent } from 'react';

import '@mantine/core/styles.css';
// import '@mantine/charts/styles.css';
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
// import '@mantine/nprogress/styles.css';

import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = createTheme({
    focusRing: 'auto',
    colors: {
        blue: [
            'var(--color-blue-50)',
            'var(--color-blue-100)',
            'var(--color-blue-200)',
            'var(--color-blue-300)',
            'var(--color-blue-400)',
            'var(--color-blue-500)',
            'var(--color-blue-600)',
            'var(--color-blue-700)',
            'var(--color-blue-800)',
            'var(--color-blue-900)',
        ],
        red: [
            'var(--color-red-50)',
            'var(--color-red-100)',
            'var(--color-red-200)',
            'var(--color-red-300)',
            'var(--color-red-400)',
            'var(--color-red-500)',
            'var(--color-red-600)',
            'var(--color-red-700)',
            'var(--color-red-800)',
            'var(--color-red-900)',
        ],
        green: [
            'var(--color-green-50)',
            'var(--color-green-100)',
            'var(--color-green-200)',
            'var(--color-green-300)',
            'var(--color-green-400)',
            'var(--color-green-500)',
            'var(--color-green-600)',
            'var(--color-green-700)',
            'var(--color-green-800)',
            'var(--color-green-900)',
        ],
        gray: [
            'var(--color-zinc-50)',
            'var(--color-zinc-100)',
            'var(--color-zinc-200)',
            'var(--color-zinc-300)',
            'var(--color-zinc-400)',
            'var(--color-zinc-500)',
            'var(--color-zinc-600)',
            'var(--color-zinc-700)',
            'var(--color-zinc-800)',
            'var(--color-zinc-900)',
        ],
        zinc: [
            'var(--color-zinc-50)',
            'var(--color-zinc-100)',
            'var(--color-zinc-200)',
            'var(--color-zinc-300)',
            'var(--color-zinc-400)',
            'var(--color-zinc-500)',
            'var(--color-zinc-600)',
            'var(--color-zinc-700)',
            'var(--color-zinc-800)',
            'var(--color-zinc-900)',
            'var(--color-zinc-950)',
        ],
    },
    components: {
        InputWrapper: {
            classNames: {
                root: 'space-y-1',
                label: 'text-slate-600 !font-semibold select-none',
            },
        },
        TextInput: {
            classNames: {
                label: '!block',
            },
        },
        Input: {
            defaultProps: {
                radius: 'sm',
                size: 'sm',
            },
        },

        PasswordInput: {
            classNames: {
                root: '',
                label: '!block',
                innerInput:
                    'data-[variant=default]:focus:ring-3 data-[variant=default]:rounded data-[variant=default]:drop-shadow data-[variant=default]:shadow-inner data-[variant=default]:!text-slate-600 data-[variant=default]:focus:ring-blue-500/20 data-[variant=default]:focus:!bg-blue-500/5 data-[variant=default]:data-[error=true]:focus:ring-red-500/20 data-[variant=default]:data-[error=true]:focus:!bg-red-500/5',
            },
            defaultProps: {
                radius: 'sm',
                size: 'sm',
            },
        },
        SegmentedControl: {
            defaultProps: {
                size: 'xs',
                withItemsBorders: false,
            },
            classNames: {
                root: '!bg-zinc-200 !shadow-inner',
                label: '!py-0.5 !px-5',
            },
        },

        Tooltip: {
            defaultProps: {
                withArrow: true,
            },
            classNames: {
                tooltip: '!text-xs !bg-zinc-800 !text-white/90',
            },
        },
        Table: {
            defaultProps: {
                highlightOnHover: true,
                withTableBorder: true,
            },
            classNames: {
                table: 'bg-white shadow shadow-slate-200',
                th: '!bg-zinc-50 !text-zinc-950/60',
                tbody: '!text-zinc-950/80 !text-xs',
            },
        },
        Button: {
            defaultProps: {
                radius: 'xl',
            },
        },
        Modal: {
            defaultProps: {
                centered: true,
                withCloseButton: false,
                padding: 'xl',
                radius: 'xl',
                overlayProps: {
                    backgroundOpacity: 0.24,
                },
                transitionProps: { transition: 'fade-up', duration: 60, timingFunction: 'linear' },
            },
        },
    },
});

interface MantineServiceProviderProps {
    children: React.ReactNode;
}

const MantineServiceProvider: FunctionComponent<MantineServiceProviderProps> = (props) => {
    const { children } = props;
    return <MantineProvider theme={theme}>{children}</MantineProvider>;
};

export default MantineServiceProvider;
