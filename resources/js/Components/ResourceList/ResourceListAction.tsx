import { isMobile } from '@/Utilities/Environment';
import { ActionIcon, Button, ButtonProps, Tooltip } from '@mantine/core';
import { FunctionComponent } from 'react';
import Navigate from '../Navigate';

interface CommonProps extends ButtonProps {
    visible?: boolean;
    tooltip?: string;
    href?: string;
    type?: 'modal' | 'page';
}

interface ResourceListActionProps extends CommonProps {
    mobileProps?: CommonProps;
    desktopProps?: CommonProps;
}

const ResourceListAction: FunctionComponent<ResourceListActionProps> = (props) => {
    const activeProps = isMobile()
        ? { ...props, ...props.mobileProps }
        : { ...props, ...props.desktopProps };
    const { visible, tooltip, type = 'modal', href, ...restProps } = activeProps;

    if (!visible) return null;

    const Action = isMobile() ? Button : ActionIcon;

    return (
        <Tooltip label={tooltip} disabled={!tooltip} position="left">
            <Navigate type={type} href={href}>
                <Action {...restProps}></Action>
            </Navigate>
        </Tooltip>
    );
};

export default ResourceListAction;
