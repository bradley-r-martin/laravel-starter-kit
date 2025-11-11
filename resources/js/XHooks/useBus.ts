import { useCallback, useMemo, useRef } from 'react';

type Listener<T = any> = (payload?: T) => void;

export interface CommandBus<T extends Record<string, any>> {
    emit<K extends keyof T>(event: K, payload: T[K]): void;
    on<K extends keyof T>(event: K, listener: Listener<T[K]>): () => void;
}

export function useBus<T extends Record<string, any>>(): CommandBus<T> {
    const listeners = useRef(new Map<keyof T, Set<Listener<any>>>());

    const emit = useCallback<CommandBus<T>['emit']>((event, payload) => {
        const subs = listeners.current.get(event);
        if (subs) for (const fn of subs) fn(payload);
    }, []);

    const on = useCallback<CommandBus<T>['on']>((event, listener) => {
        let subs = listeners.current.get(event);
        if (!subs) listeners.current.set(event, (subs = new Set()));
        subs.add(listener);
        return () => subs.delete(listener);
    }, []);

    return useMemo(() => ({ emit, on }), [emit, on]);
}
