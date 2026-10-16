import type { UserRole } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Authentication required");
  }

  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireSession();

  if (session.user.role !== role) {
    throw new Error("Insufficient permissions");
  }

  return session;
}
