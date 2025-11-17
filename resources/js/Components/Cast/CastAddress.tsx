import { addressToEnvelopeString, addressToString } from '@/Utilities/Transformers';
import { FunctionComponent, ReactNode } from 'react';

interface CastAddressProps {
    children: Domain.Address | null;
    format?: 'envelope' | 'string';
    fallback?: ReactNode;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}

const CastAddress: FunctionComponent<CastAddressProps> = (props) => {
    const { children, format = 'string', fallback, leftSection, rightSection } = props;
    try {
        return <>{leftSection}{format === 'envelope' ? addressToEnvelopeString(children as Domain.Address) : addressToString(children as Domain.Address) || fallback || 'Err'}{rightSection}</>;
    } catch (_e) {
        return fallback || 'Err';
    }
};

export default CastAddress;
