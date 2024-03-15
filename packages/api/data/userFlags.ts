import { PrismaClient } from "@prisma/client";
import { cache } from "./cache";

type CreateUserFlagDto = {
  projectId: string;
  flagKey: string;
  userId: string;
  enabled: boolean;
};

export async function createUserFlag({
  projectId,
  flagKey,
  ...userFlag
}: CreateUserFlagDto) {
  const prisma = new PrismaClient();
  try {
    const flag = await prisma.flag.findFirst({
      where: {
        projectId,
        key: flagKey,
      },
    });

    if (!flag) {
      throw Error("flag not found");
    }

    const result = await prisma.userFlag.create({
      data: { ...userFlag, flagId: flag.id },
    });

    // Clear project flags from the cache
    cache.clear([flag.projectId]);

    return result;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

type UpdateUserFlagDto = {
  projectId: string;
  flagKey: string;
  userId: string;
  enabled: boolean;
};

export async function updateUserFlag({
  projectId,
  flagKey,
  ...userFlag
}: UpdateUserFlagDto) {
  const prisma = new PrismaClient();
  try {
    const flag = await prisma.flag.findFirst({
      where: {
        projectId,
        key: flagKey,
      },
    });

    if (!flag) {
      throw Error("flag not found");
    }

    const result = await prisma.userFlag.update({
      where: {
        userFlagId: {
          userId: userFlag.userId,
          flagId: flag.id,
        },
      },
      data: { enabled: userFlag.enabled },
    });

    // Clear project flags from the cache
    cache.clear([flag.projectId]);

    return result;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

type DeleteUserFlagDto = {
  projectId: string;
  flagKey: string;
  userId: string;
};

export async function deleteUserFlag({
  projectId,
  flagKey,
  ...userFlag
}: UpdateUserFlagDto) {
  const prisma = new PrismaClient();
  try {
    const flag = await prisma.flag.findFirst({
      where: {
        projectId,
        key: flagKey,
      },
    });

    if (!flag) {
      throw Error("flag not found");
    }

    const result = await prisma.userFlag.delete({
      where: {
        userFlagId: {
          userId: userFlag.userId,
          flagId: flag.id,
        },
      },
    });

    // Clear project flags from the cache
    cache.clear([flag.projectId]);

    return result;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
