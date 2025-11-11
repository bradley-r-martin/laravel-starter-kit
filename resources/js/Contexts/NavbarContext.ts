import { UseDisclosureReturnValue } from '@mantine/hooks';
import { createContext } from 'react';

const NavbarContext = createContext<UseDisclosureReturnValue | null>(null);

export default NavbarContext;
