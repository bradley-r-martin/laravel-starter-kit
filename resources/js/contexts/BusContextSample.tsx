import React, { createContext, useContext, useMemo } from 'react';
import { CommandBus, useBus } from '../XHooks/useBus';

export type ChatEvents = {
    focusInput: void;
    scrollToBottom: void;
    newMessage: { text: string };
};

export interface ChatContextValue {
    bus: CommandBus<ChatEvents>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const bus = useBus<ChatEvents>();

    // Ensure a stable value reference
    const value = useMemo(() => ({ bus }), [bus]);

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChat must be used within ChatProvider');
    return ctx;
}
