#!/usr/bin/env node

import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const absPnpApiPath = resolve(process.cwd(), ".pnp.cjs");
const absRequire = createRequire(absPnpApiPath);

if (existsSync(absPnpApiPath)) {
  if (!process.versions.pnp) {
    // Setup the environment to be able to require typescript/lib/tsc.js
    require(absPnpApiPath).setup();
  }
}
// Defer to the real typescript/lib/tsc.js your application uses
export default absRequire("typescript/lib/tsc.js");
