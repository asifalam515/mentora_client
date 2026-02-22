// lib/get-session.ts

import { authClient } from "./auth";

export const getServerSession = async () => {
  const session = await authClient.getSession();

  return session;
};
