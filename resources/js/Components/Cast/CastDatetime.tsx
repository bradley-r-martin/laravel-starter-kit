import dayjs from 'dayjs';
import { FunctionComponent, ReactNode } from 'react';

interface CastDatetimeProps {
    format?: string;
    children: string | null;
    fallback?: ReactNode;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}

const CastDatetime: FunctionComponent<CastDatetimeProps> = (props) => {
    const { format = 'DD/MM/YYYY', children, fallback, leftSection, rightSection } = props;
    if (!children && fallback) {
        return fallback;
    }
    try {
        return <>{leftSection}{dayjs(children).format(format)}{rightSection}</>;
    } catch (_e) {
        return fallback || 'Err';
    }
};

export default CastDatetime;
