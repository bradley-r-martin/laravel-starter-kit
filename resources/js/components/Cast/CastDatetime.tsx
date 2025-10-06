import dayjs from 'dayjs';
import { FunctionComponent, ReactNode } from 'react';

interface CastDatetimeProps {
    format: string;
    children: string | null;
    fallback?: ReactNode;
}

const CastDatetime: FunctionComponent<CastDatetimeProps> = (props) => {
    const { format, children, fallback } = props;
    if (!children && fallback) {
        return fallback;
    }
    return dayjs(children).format(format) || fallback;
};

export default CastDatetime;
