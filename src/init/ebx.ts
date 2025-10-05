import { join } from "node:path";
import { isExists, write } from "../utils/fs";
import { ebxConfig } from "./stubs/ebx.config";

export async function dumpEBXConfig() {
  const configPath = join(process.cwd(), "ebx.config.js");
  if (isExists(configPath)) return;
  write(configPath, ebxConfig());
}
