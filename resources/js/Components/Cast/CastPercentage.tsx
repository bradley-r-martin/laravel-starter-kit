import { FunctionComponent } from 'react';

interface CastPercentageProps {
    children: number | null;
}

const CastPercentage: FunctionComponent<CastPercentageProps> = (props) => {
    const { children } = props;
    return Number(children)?.toFixed(2) + '%';
};

export default CastPercentage;
