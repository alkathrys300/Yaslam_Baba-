import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to run the seed");
}

const adminEmailValue = adminEmail;
const adminPasswordValue = adminPassword;

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmailValue },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { role: UserRole.admin },
    });
    console.log(`Admin role ensured for ${adminEmailValue}`);
    return;
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: "مدير يسلم بابا",
      email: adminEmailValue,
      password: adminPasswordValue,
    },
  });

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: UserRole.admin },
  });

  console.log(`Admin account created for ${adminEmailValue}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
