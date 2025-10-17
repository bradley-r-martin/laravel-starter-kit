import numbro from 'numbro';
import { FunctionComponent, ReactNode } from 'react';

interface CastCurrencyProps {
    children: number | null;
    format?: string;
    fallback?: ReactNode;
}

const CastCurrency: FunctionComponent<CastCurrencyProps> = (props) => {
    const { children, format = '$0,0.00', fallback } = props;
    try {
        return numbro((children ?? 0) / 100).format(format);
    } catch (_e) {
        return fallback || 'Err';
    }
};

export default CastCurrency;
