import { PrismaClient } from "@prisma/client";
import { cache } from "./cache";
import z from "zod";

type CreateFlagDto = {
  key: string;
  title: string;
  description?: string;
  defaultEnabled?: boolean;
  projectId: string;
};

type UpdateFlagDto = CreateFlagDto & {
  flagId: string;
};

export async function createFlag(flag: CreateFlagDto) {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.flag.create({
      data: flag,
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

export async function updateFlag({
  flagId,
  projectId,
  ...flag
}: UpdateFlagDto) {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.flag.update({
      where: {
        id: flagId,
      },
      data: flag,
    });

    // Clear project flags from the cache
    cache.clear([projectId]);

    return result;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

type DeleteFlagDto = {
  flagId: string;
  projectId: string;
};

export async function deleteFlag({ flagId, projectId }: DeleteFlagDto) {
  const prisma = new PrismaClient();
  console.log("deleting", { flagId, projectId });
  try {
    const result = await prisma.flag.delete({
      where: {
        id: flagId,
      },
    });

    // Clear project flags from the cache
    cache.clear([projectId]);

    return result;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

const flagsForUserSchema = z.object({
  lastUpdated: z.string().optional(),
  flags: z.array(z.string()),
});

type FlagsForUserResult = z.infer<typeof flagsForUserSchema>;

export async function getFlagsForUser({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}): Promise<FlagsForUserResult | null> {
  const cacheKey = [projectId, userId];
  if (cache.has(cacheKey)) {
    try {
      console.log("from cache", JSON.stringify(cacheKey), cache.get(cacheKey));
      return flagsForUserSchema.parse(cache.get(cacheKey));
    } catch (e) {
      console.error(e);
    }
  }

  const prisma = new PrismaClient();
  console.log("cache miss", JSON.stringify(cacheKey));

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
      .map((flag) => flag.updatedAt.toISOString())
      .sort()
      .at(-1);

    const result: FlagsForUserResult = {
      flags: enabledFlags,
      lastUpdated,
    };

    cache.set(cacheKey, result);

    return result;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }

  return null;
}
