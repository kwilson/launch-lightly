import { PrismaClient } from "@prisma/client";
import hash from "object-hash";
import { cache } from "./cache";
import z from "zod";

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
  const cachKey = hash({ projectId, userId });
  if (cache.has(cachKey)) {
    try {
      return flagsForUserSchema.parse(cache.get(cachKey));
    } catch (e) {
      console.error(e);
    }
  }

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

    const result: FlagsForUserResult = {
      flags: enabledFlags,
      lastUpdated: lastUpdated?.toISOString(),
    };

    cache.set(cachKey, result);

    return result;
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
  }

  return null;
}
