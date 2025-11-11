import NavbarContext from '@/Contexts/NavbarContext';
import { useContext } from 'react';

const useNavbar = () => {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error('useNavbar must be used within a NavbarContext.Provider');
    }
    return context;
};

export default useNavbar;
