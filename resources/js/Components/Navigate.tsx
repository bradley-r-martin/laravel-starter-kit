import { setNavigatePointerPosition } from '@/Stores/navigatePointerPosition';
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

type NavigateType = 'modal' | 'page' | 'manual';

type NavigateProps = ComponentPropsWithoutRef<'a'> & {
    type: NavigateType;
};

const Navigate = forwardRef<HTMLElement, NavigateProps>((props, ref) => {
    const { type, onPointerDown, ...restProps } = props;

    const [loading, setLoading] = useState(false);

    const handlePointerDown = useCallback<PointerEventHandler<HTMLElement>>(
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
            : type === 'page'
              ? {
                    component: Link,
                    loading: loading,
                    onStart: () => setLoading(true),
                    onSuccess: () => setLoading(false),
                }
              : {};

    return <Slot ref={ref} {...restProps} {...componentProps} onPointerDown={handlePointerDown} />;
});

Navigate.displayName = 'Navigate';

export default Navigate;
