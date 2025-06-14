import { SearchParams } from "nuqs/server";

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<SearchParams>;
}
