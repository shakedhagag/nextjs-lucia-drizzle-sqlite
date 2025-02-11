import "server-only";
import { cookies } from "next/headers";
import { lucia } from "@/auth";
import { validateRequest } from "@/auth";
import { cache } from "react";
import { AuthenticationError } from "../use-cases/errors";
import { UserId } from "@/use-cases/types";

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) {
    return undefined;
  }
  return session.user;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export async function setSession(userId: UserId) {
  try {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    console.log(`THE ERROR: ${e}`);
  }
}
