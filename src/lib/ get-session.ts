"use server";
import { authClient } from "./auth";

export const getServerSession = async () => {
  const { data: session } = await authClient.useSession();
  return session;
};
