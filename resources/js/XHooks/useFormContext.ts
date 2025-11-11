import FormContext from '@/contexts/FormContext';
import { useContext } from 'react';

export default function useFormContext() {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormContext');
    }
    return context;
}
