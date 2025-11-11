import { FunctionComponent } from 'react';
import CastCurrency from './CastCurrency';
import CastDatetime from './CastDatetime';
import CastPercentage from './CastPercentage';

interface Composition {
    Datetime: typeof CastDatetime;
    Percentage: typeof CastPercentage;
    Currency: typeof CastCurrency;
}

const Cast: FunctionComponent & Composition = () => {
    return null;
};
Cast.Datetime = CastDatetime;
Cast.Percentage = CastPercentage;
Cast.Currency = CastCurrency;

export default Cast;
