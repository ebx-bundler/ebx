import { packageInfo } from "../project";

export async function dumpEBXConfig() {
  const isModule = packageInfo.type === "module";
  const configFileName = isModule ? "ebx.config.js" : "ebx.config.mjs";
  console.log("generating config file", configFileName);
}
