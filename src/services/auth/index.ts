"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const setCookies = async (data: any) => {
  const storeCookie = await cookies();
  storeCookie.set("token", data.token);
};
export const getUserData = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  let decodedData = null;
  if (token) {
    decodedData = await jwtDecode(token);
    return decodedData;
  } else {
    return null;
  }
};
