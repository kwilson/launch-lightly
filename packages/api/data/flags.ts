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

export async function getFlagsForUser({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const prisma = new PrismaClient();

  try {
    const flags = await prisma.flag.findMany({
      where: {
        projectId,
      },
      select: {
        key: true,
        defaultEnabled: true,
        updatedAt: true,
        userFlags: {
          where: {
            userId,
          },
        },
      },
    });

    const enabledFlags = flags
      .filter((flag) => flag.userFlags.at(0)?.enabled ?? flag.defaultEnabled)
      .map((flag) => flag.key);

    const lastUpdated = flags
      .map((flag) => flag.updatedAt)
      .sort()
      .at(0);

    return {
      flags: enabledFlags,
      lastUpdated,
    };
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
  }
}
