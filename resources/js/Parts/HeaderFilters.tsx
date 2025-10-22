import { motion, MotionValue, useTransform } from 'motion/react';
import { FunctionComponent } from 'react';

interface HeaderFiltersProps {
    children: React.ReactNode;
    position: MotionValue<number>;
}

const HeaderFilters: FunctionComponent<HeaderFiltersProps> = (props) => {
    const { children, position } = props;
    const margin = 20;
    const filtersBackgroundColor = useTransform(
        position,
        [0, margin],
        ['rgba(255,255,255,0.4)', 'rgba(240,240,240,0)']
    );
    const filtersBorderColor = useTransform(
        position,
        [0, margin],
        ['rgba(224,224,224,1)', 'rgba(224,224,224,0)']
    );
    const filtersMargin = useTransform(position, [0, margin], [12, 0]);
    const filtersShadow = useTransform(
        position,
        [0, margin],
        ['0 0 10px 0 rgba(0,0,0,0.1)', '0 0 10px 0 rgba(0,0,0,0)']
    );

    return (
        <motion.div
            style={{
                backgroundColor: filtersBackgroundColor,
                borderColor: filtersBorderColor,
                borderWidth: '1px',
                borderStyle: 'solid',
                marginLeft: filtersMargin,
                marginRight: filtersMargin,
                boxShadow: filtersShadow,
            }}
            data-testid="filters-bar"
            className="rounded px-2 py-1"
        >
            {children}
        </motion.div>
    );
};

export default HeaderFilters;
