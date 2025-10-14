import { InertiaLinkProps, Link } from "@inertiajs/react";
import { forwardRef } from "react";
import { ModalLink } from "@inertiaui/modal-react";


type NavigateProps = {
    type: 'modal'
} & React.AnchorHTMLAttributes<HTMLAnchorElement> | {
    type: 'page'
} & InertiaLinkProps

const Navigate = forwardRef<HTMLAnchorElement, NavigateProps>((props, ref) => {

    const { type, ...restProps } = props;

    if (type === 'modal') {
        return <ModalLink ref={ref}  {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}  />;
    } else if (type === 'page') {
        return <Link ref={ref} {...(restProps as InertiaLinkProps)} />;
    }

});

Navigate.displayName = "Navigate";
 
export default Navigate;