import { PrismaClient } from "@prisma/client";

export async function getAllProjects(limit = 10) {
  const prisma = new PrismaClient();

  try {
    return await prisma.project.findMany({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
      take: limit,
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();

    throw e;
  }
}

type CreateProjectDto = {
  id: string;
  title: string;
  description?: string;
};

export async function createProject(project: CreateProjectDto) {
  const prisma = new PrismaClient();

  try {
    return await prisma.project.create({
      data: project,
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
  }
}

export async function getProjectDetails(projectId: string) {
  const prisma = new PrismaClient();

  try {
    return await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        flags: {
          include: {
            userFlags: true,
          },
        },
      },
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
  }
}
