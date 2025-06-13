import { parseAsString, createLoader, parseAsInteger } from "nuqs/server";

export const querySearchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  query: parseAsString.withDefault(""),
  filter: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(querySearchParams);
