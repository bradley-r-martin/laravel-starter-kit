import { FunctionComponent, ReactNode } from 'react';

interface EmptyProps {
    title?: string;
    subtitle?: string;
    children?: ReactNode;
}

const Empty: FunctionComponent<EmptyProps> = (props) => {
    const { children, title, subtitle } = props;
    return (
        <div className="relative flex flex-col items-center gap-4 py-10">
            {(title || subtitle) && (
                <div className="flex flex-col items-center gap-1 select-none">
                    {title && (
                        <div className="text-xs font-bold tracking-tight text-zinc-950/70 uppercase">
                            {title}
                        </div>
                    )}
                    {subtitle && (
                        <div className="text-xs tracking-tight text-zinc-950/60">{subtitle}</div>
                    )}
                </div>
            )}
            <div className="w-full max-w-xs">
                <div className="rounded bg-zinc-50 p-2 shadow">
                    <div className="h-1 w-full rounded-full bg-zinc-950/20"></div>
                </div>
                <div className="-mt-2 scale-95 rounded bg-zinc-50 p-2 opacity-50 shadow">
                    <div className="h-1 w-full rounded-full bg-zinc-950/20"></div>
                </div>

                <div className="-mt-2 scale-90 rounded bg-zinc-50 p-2 opacity-30 shadow">
                    <div className="h-1 w-full rounded-full bg-zinc-950/20"></div>
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
};

export default Empty;
