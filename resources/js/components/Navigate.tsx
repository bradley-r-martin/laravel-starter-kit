import { setNavigatePointerPosition } from '@/stores/navigatePointerPosition';
import { isStandalone } from '@/Utilities/Environment';
import { Link } from '@inertiajs/react';
import { ModalLink } from '@inertiaui/modal-react';
import { Slot } from '@radix-ui/react-slot';
import {
    forwardRef,
    useCallback,
    useState,
    type ComponentPropsWithoutRef,
    type PointerEventHandler,
} from 'react';

type NavigateProps = ComponentPropsWithoutRef<'a'> & {
    type: 'modal' | 'page';
};

const Navigate = forwardRef<HTMLAnchorElement, NavigateProps>((props, ref) => {
    const { type, onPointerDown, ...restProps } = props;

    const [loading, setLoading] = useState(false);

    const handlePointerDown = useCallback<PointerEventHandler<HTMLAnchorElement>>(
        (event) => {
            const element = event.currentTarget;
            const rect = element.getBoundingClientRect();
            setNavigatePointerPosition({
                x: rect.left + window.scrollX + rect.width / 2,
                y: rect.top + window.scrollY + rect.height / 2,
            });
            onPointerDown?.(event);
        },
        [onPointerDown]
    );

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

    return <Slot ref={ref} {...restProps} {...componentProps} onPointerDown={handlePointerDown} />;
});

Navigate.displayName = 'Navigate';

export default Navigate;
