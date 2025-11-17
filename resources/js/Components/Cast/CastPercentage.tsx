import numbro from 'numbro';
import { FunctionComponent, ReactNode } from 'react';

interface CastPercentageProps {
    children: number | null;
    format?: string;
    fallback?: ReactNode;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}

const CastPercentage: FunctionComponent<CastPercentageProps> = (props) => {
    const { children, format = '0.00%', fallback, leftSection, rightSection } = props;
    try {
        return (
            <>
                {leftSection}
                {numbro(children ?? 0).format(format)}
                {rightSection}
            </>
        );
    } catch (_e) {
        return fallback || 'Err';
    }
};

export default CastPercentage;
