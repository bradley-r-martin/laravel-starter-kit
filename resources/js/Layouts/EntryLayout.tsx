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
                {children}
            </div>
            <div className="flex w-full flex-col items-center justify-center pt-10">
                <Logo className="h-20 lg:h-32" />
            </div>
        </div>
    );
};

export default EntryLayout;
