"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
exports.default = (0, config_1.defineConfig)({
    schema: 'src/database/prisma/schema.prisma',
    // seed: 'ts-node prisma/seed.ts',
});
