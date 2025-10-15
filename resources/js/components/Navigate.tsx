import { isStandalone } from '@/Utilities/Environment';
import { Link } from '@inertiajs/react';
import { ModalLink } from '@inertiaui/modal-react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useState } from 'react';

type NavigateProps = {
    type: 'modal' | 'page';
    children?: React.ReactNode;
    href?: string;
};

const Navigate = forwardRef<HTMLAnchorElement, NavigateProps>((props, ref) => {
    const { type, ...restProps } = props;

    const [loading, setLoading] = useState(false);

    const componentProps =
        type === 'modal'
            ? {
                  component: ModalLink,
                  navigate: !isStandalone(),
                  loading: loading,
                  onStart: () => setLoading(true),
                  onSuccess: () => setLoading(false),
              }
            : {
                  component: Link,
                  loading: loading,
                  onStart: () => setLoading(true),
                  onSuccess: () => setLoading(false),
              };

    return <Slot ref={ref} {...restProps} {...componentProps} />;
});

Navigate.displayName = 'Navigate';

export default Navigate;
