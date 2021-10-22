import React, { useMemo } from 'react';
import { Container } from 'inversify';

import { InjectableContext, InjectableContextValue } from './injectableContext.component';

export interface InjectableProviderProps {
    container: Container;
}

export const InjectableProvider: React.FC<InjectableProviderProps> = ({ container, children }) => {
    const contextValue: InjectableContextValue = useMemo(() => {
        return {
            container,
        };
    }, [container]);

    return <InjectableContext.Provider value={contextValue}>{children}</InjectableContext.Provider>;
};
