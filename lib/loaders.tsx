import { parseAsString, createLoader } from "nuqs";

export const querySearchParams = {
  query: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(querySearchParams);
