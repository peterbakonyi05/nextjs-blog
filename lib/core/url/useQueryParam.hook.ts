import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useCallback } from "react";
import { CoreUrlUtil } from "./coreUrl.util";

export interface QueryParamsHookResult {
  // TODO: this should be converted to `URLSearchParams` since we use that and it is the standard, `ParsedUrlQuery` is deprecated
  queryParams: ParsedUrlQuery;
  updateQueryParams: (partialUpdate: Record<string, string>) => void;
}

export const useQueryParams = (): QueryParamsHookResult => {
  const router = useRouter();

  const updateQueryParams = useCallback(
    (partialUpdate: Record<string, string | string[]>) => {
      router.replace(
        CoreUrlUtil.setQueryParams(router.pathname, {
          ...router.query,
          ...partialUpdate,
        }),
        undefined,
        { shallow: true }
      );
    },
    []
  );

  return {
    queryParams: router.query,
    updateQueryParams,
  };
};
