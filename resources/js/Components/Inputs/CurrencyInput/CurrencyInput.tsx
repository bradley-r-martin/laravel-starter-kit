import { FunctionComponent } from 'react';
import Slot from '../../Slot';

interface CurrencyInputProps {
    children: React.ReactNode;
    value?: number | string;
    onChange?: (value: number | string) => void;
}

const CurrencyInput: FunctionComponent<CurrencyInputProps> = (props) => {
    const { children, value, onChange, ...restProps } = props;

    // Convert value from cents to dollars
    const dollarValue =
        value !== undefined && value !== null && value !== ''
            ? typeof value === 'number'
                ? value / 100
                : parseFloat(String(value)) / 100
            : value;

    // Convert onChange value from dollars back to cents
    const handleChange = onChange
        ? (newValue: number | string) => {
              if (newValue === undefined || newValue === null || newValue === '') {
                  onChange(newValue);
                  return;
              }
              const dollarAmount =
                  typeof newValue === 'number' ? newValue : parseFloat(String(newValue));
              const centsAmount = Math.round(dollarAmount * 100);
              onChange(centsAmount);
          }
        : undefined;

    return (
        <Slot {...restProps} value={dollarValue} onChange={handleChange}>
            {children}
        </Slot>
    );
};

export default CurrencyInput;
