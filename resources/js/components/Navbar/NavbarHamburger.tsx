import useNavbar from '@/XHooks/useNavbar';
import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const NavbarHamburger: FunctionComponent<HTMLAttributes<HTMLButtonElement>> = (props) => {
    const { className, ...restProps } = props;
    const [opened, { toggle }] = useNavbar();
    return (
        <button
            aria-label="Open navigation"
            className={twMerge(
                'relative flex min-w-0 shrink-0 cursor-default items-center gap-3 rounded-lg p-1 text-left text-base/6 font-medium text-zinc-950 hover:bg-zinc-950/5 active:bg-zinc-950/5 lg:hidden',
                className
            )}
            type="button"
            onClick={toggle}
            data-active={opened}
            {...restProps}
        >
            {/* <TouchTarget /> */}
            <svg viewBox="0 0 100 100" className={`ham size-10`} data-active={opened}>
                <path
                    className="line top"
                    d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
                />
                <path className="line" d="m 70,50 h -40" />
                <path
                    className="line bottom"
                    d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
                />
            </svg>
        </button>
    );
};

export default NavbarHamburger;
