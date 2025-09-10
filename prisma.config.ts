import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'src/database/prisma/schema.prisma',
  // seed: 'ts-node prisma/seed.ts',
});
