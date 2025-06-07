import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

interface RemoveUrlQueryParams {
  params: string;
  keyToRemove: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const queryString = qs.parse(params);

  queryString[key] = value;

  return qs.stringify(queryString);
};

export const removeKeyFromUrlQuery = ({
  params,
  keyToRemove,
}: RemoveUrlQueryParams) => {
  const queryString = qs.parse(params);

  keyToRemove.forEach((key) => {
    delete queryString[key];
  });

  return qs.stringify(queryString, { skipNull: true });
};
