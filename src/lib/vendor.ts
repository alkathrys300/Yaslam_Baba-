import { StoreStatus, UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export async function approveStore(storeId: string) {
  return prisma.$transaction(async (transaction) => {
    const store = await transaction.store.update({
      where: { id: storeId },
      data: { status: StoreStatus.approved },
    });

    await transaction.user.update({
      where: { id: store.ownerId },
      data: { role: UserRole.vendor },
    });

    return store;
  });
}
