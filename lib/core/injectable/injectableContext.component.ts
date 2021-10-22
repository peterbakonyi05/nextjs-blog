import React from 'react';
import { Container } from 'inversify';

export interface InjectableContextValue {
    container: Container;
}

// eslint-disable-next-line no-null/no-null
export const InjectableContext = /*#__PURE__*/ React.createContext(null);
