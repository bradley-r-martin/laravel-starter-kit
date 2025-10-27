import { FunctionComponent } from 'react';
import Logo from '../../img/Logo.svg?react';
interface EntryLayoutProps {
    children: React.ReactNode;
}

const EntryLayout: FunctionComponent<EntryLayoutProps> = (props) => {
    const { children } = props;

    return (
        <div className="flex w-full flex-1 flex-col-reverse items-center justify-between space-y-5 space-y-reverse overflow-hidden lg:flex-row lg:space-y-0 lg:space-x-4 lg:px-5">
            <div className="relative flex w-full max-w-md flex-1 flex-col justify-end overflow-hidden border-gray-300 backdrop-blur max-md:mx-auto lg:flex-auto lg:rounded-lg lg:border lg:bg-white/70 lg:shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                        backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
                        backgroundSize: '40px 40px',
                        WebkitMaskImage:
                            'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
                        maskImage:
                            'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
                    }}
                />
                <div className="relative z-10">{children}</div>
            </div>
            <div className="flex w-full flex-col items-center justify-center pt-10">
                <Logo className="h-20 lg:h-32" />
            </div>
        </div>
    );
};

export default EntryLayout;
