import ContentContext from '@/contexts/ContentContext';
import { useContext } from 'react';

export default function useContentContext() {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContentContext must be used within a ContentContext');
    }
    return context;
}
