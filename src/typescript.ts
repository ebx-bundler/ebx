import { extname } from "node:path";
import { isExists, write } from "./fs";
import { packageInfo } from "./package";

export function isTypescript(fname: string) {
  return extname(fname) === ".ts";
}

export async function dumpConfig(name: string) {
  if (isExists(name)) return;
  const { default: stub }: any = await import("./tsconfig.stub.json");
  if (packageInfo.type === "module") {
    stub.compilerOptions.module = "ESNext";
  }
  write(name, JSON.stringify(stub, null, 2));
}
