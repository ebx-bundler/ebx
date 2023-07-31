import { extname } from "node:path";
import { isExists, write } from "./fs";

export function isTypescript(fname: string) {
  return extname(fname) === ".ts";
}

export async function dumpConfig() {
  if (isExists("tsconfig.json")) return;
  const { default: stub } = await import("./tsconfig.stub.json");
  write("tsconfig.json", JSON.stringify(stub, null, 2));
}
