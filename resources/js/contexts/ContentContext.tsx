import { createContext } from "react";

type ContentContextType = {
    ref: React.RefObject<HTMLDivElement>;
    opened: boolean;
    open: () => void;
    close: () => void;
};


const ContentContext = createContext<ContentContextType | undefined>(undefined);

export default ContentContext;