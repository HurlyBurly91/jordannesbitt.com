import { catalogue } from "../data/catalogue.ts";
import { searchEntries } from "../lib/search.ts";
export const prerender = true;
export function GET() { return new Response(JSON.stringify(searchEntries(catalogue)), { headers: { "Content-Type": "application/json; charset=utf-8" } }); }
