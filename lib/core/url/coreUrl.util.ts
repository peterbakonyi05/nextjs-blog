export const CoreUrlUtil = {
  setQueryParams(
    url: string,
    queryParams:
      | Record<string, string[] | string | number | undefined>
      | undefined
  ): string {
    if (!queryParams) {
      return url;
    }

    const [baseUrl, existingQueryParams] = url.split("?");

    const encodedQueryParams = Object.keys(queryParams).reduce(
      (result, key) => {
        const value = queryParams[key];
        if (typeof value === "undefined") {
          return result;
        }
        return result.concat([
          `${encodeURIComponent(key)}=${encodeURIComponent(
            Array.isArray(value) ? value.join(",") : value
          )}`,
        ]);
      },
      existingQueryParams ? [existingQueryParams] : []
    );
    if (!encodedQueryParams.length) {
      return baseUrl;
    }
    return `${baseUrl}?${encodedQueryParams.join("&")}`;
  },
};
