import { createAuthClient } from "better-auth/react";
import {
  twoFactorClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { getAuth } from "@/lib/auth";
export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({ twoFactorPage: "/account/verify" }),
    inferAdditionalFields<ReturnType<typeof getAuth>>(),
  ],
});
