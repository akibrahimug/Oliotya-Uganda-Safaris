import { prisma } from '../db';

describe('Database Connection', () => {
  it('should connect to database', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it('should execute a simple query', async () => {
    const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 as value`;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('value', 1);
  });

  it('should check database version', async () => {
    const result = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`;
    expect(result).toBeDefined();
    expect(result[0]).toHaveProperty('version');
    expect(result[0].version).toContain('PostgreSQL');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
