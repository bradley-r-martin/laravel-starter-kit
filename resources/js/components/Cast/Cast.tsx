import { FunctionComponent } from 'react';
import CastDatetime from './CastDatetime';
import CastPercentage from './CastPercentage';

interface Composition {
    Datetime: typeof CastDatetime;
    Percentage: typeof CastPercentage;
}

const Cast: FunctionComponent & Composition = () => {
    return null;
};
Cast.Datetime = CastDatetime;
Cast.Percentage = CastPercentage;

export default Cast;
