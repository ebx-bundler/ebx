import { extname } from "node:path";
import { isExists, write } from "./fs";
import { PackageInfo } from "./package";

export function isTypescript(fname: string) {
  return extname(fname) === ".ts";
}

export async function dumpConfig(info: PackageInfo) {
  if (isExists("tsconfig.json")) return;
  const { default: stub }: any = await import("./tsconfig.stub.json");
  if (info.type === "module") {
    stub.compilerOptions.module = "ESNext";
  }
  write("tsconfig.json", JSON.stringify(stub, null, 2));
}
