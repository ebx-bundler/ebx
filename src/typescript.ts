import { extname } from "node:path";
import { isExists, write } from "./fs";
import { packageInfo } from "./package";

export function isTypescript(fname: string) {
  return extname(fname) === ".ts";
}

export async function dumpConfig() {
  if (isExists("tsconfig.json")) return;
  const { default: stub }: any = await import("./tsconfig.stub.json");
  if (packageInfo.type === "module") {
    stub.compilerOptions.module = "ESNext";
  }
  write("tsconfig.json", JSON.stringify(stub, null, 2));
}
