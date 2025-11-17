import numbro from 'numbro';
import { FunctionComponent, ReactNode } from 'react';

interface CastCurrencyProps {
    children: number | null;
    format?: string;
    fallback?: ReactNode;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}

const CastCurrency: FunctionComponent<CastCurrencyProps> = (props) => {
    const { children, format = '$0,0.00', fallback, leftSection, rightSection } = props;
    try {
        return <>{leftSection}{numbro((children ?? 0) / 100).format(format)}{rightSection}</>;
    } catch (_e) {
        return fallback || 'Err';
    }
};

export default CastCurrency;
