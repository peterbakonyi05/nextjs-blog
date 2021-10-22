import { useRef } from 'react';

interface ResultBox<T> {
    v: T;
}

/**
 * Create a constant value once and lazily.
 * https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
 */
export const useConstant = <T>(fn: () => T): T => {
    const ref = useRef<ResultBox<T>>();

    if (!ref.current) {
        ref.current = { v: fn() };
    }

    return ref.current.v;
};
