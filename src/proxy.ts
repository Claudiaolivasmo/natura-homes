import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Admin pages and APIs must not be rewritten as localized routes.
  matcher: ["/((?!api|admin(?:/|$)|_next|_vercel|.*\\..*).*)"],
};
