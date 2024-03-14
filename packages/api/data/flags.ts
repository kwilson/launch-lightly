import { PrismaClient } from "@prisma/client";

type CreateFlagDto = {
  key: string;
  title: string;
  description?: string;
  defaultEnabled?: boolean;
  projectId: string;
};

export async function createFlag(flag: CreateFlagDto) {
  const prisma = new PrismaClient();

  try {
    return await prisma.flag.create({
      data: flag,
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
  }
}
