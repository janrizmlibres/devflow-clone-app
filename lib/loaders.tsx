import { parseAsString, createLoader } from "nuqs/server";

export const querySearchParams = {
  query: parseAsString.withDefault(""),
  filter: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(querySearchParams);
