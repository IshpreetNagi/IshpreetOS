import "server-only";

import { parseServerEnvironment } from "./schema";

export const serverEnvironment = parseServerEnvironment({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
