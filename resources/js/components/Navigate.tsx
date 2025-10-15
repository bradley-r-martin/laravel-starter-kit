import { isStandalone } from '@/Utilities/Environment';
import { InertiaLinkProps, Link } from '@inertiajs/react';
import { ModalLink } from '@inertiaui/modal-react';
import { forwardRef } from 'react';

type NavigateProps =
    | ({
          type: 'modal';
      } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({
          type: 'page';
      } & InertiaLinkProps);

const Navigate = forwardRef<HTMLAnchorElement, NavigateProps>((props, ref) => {
    const { type, ...restProps } = props;

    if (type === 'modal') {
        return (
            <ModalLink
                ref={ref}
                navigate={!isStandalone()} // Disable navigation in standalone mode
                {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            />
        );
    } else if (type === 'page') {
        return <Link ref={ref} {...(restProps as InertiaLinkProps)} />;
    }
});

Navigate.displayName = 'Navigate';

export default Navigate;
