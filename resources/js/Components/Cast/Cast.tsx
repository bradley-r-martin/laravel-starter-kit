import { FunctionComponent } from 'react';
import CastAddress from './CastAddress';
import CastCurrency from './CastCurrency';
import CastDatetime from './CastDatetime';
import CastPercentage from './CastPercentage';

interface Composition {
    Datetime: typeof CastDatetime;
    Percentage: typeof CastPercentage;
    Currency: typeof CastCurrency;
    Address: typeof CastAddress;
}

const Cast: FunctionComponent & Composition = () => {
    return null;
};
Cast.Datetime = CastDatetime;
Cast.Percentage = CastPercentage;
Cast.Currency = CastCurrency;
Cast.Address = CastAddress;

export default Cast;
