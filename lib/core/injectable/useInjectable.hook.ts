import { useContext } from "react";
import { interfaces } from "inversify";

import {
  InjectableContext,
  InjectableContextValue,
} from "../injectable/injectableContext.component";
import { useConstant } from "../constant/useConstant.hook";


/**
 * Resolve the provided token.
 * @param token
 */
export const useInjectable = <T>(token: interfaces.ServiceIdentifier<T>): T => {
  const { container }: InjectableContextValue = useContext(InjectableContext);
  return useConstant(() => container.get(token));
};
