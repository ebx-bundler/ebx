import { pathToFileURL } from "node:url";
import type { EBXConfig } from "./types";

export async function loadOptionsStrict(filename: string): Promise<EBXConfig> {
  const config = await import(pathToFileURL(filename).href);
  return config.default;
}

export async function loadOptions(
  file: string,
  ext: string[],
  i = 0
): Promise<EBXConfig> {
  try {
    const config = await import(pathToFileURL(`${file}.${ext[i]}`).href);
    return config.default;
  } catch (err: any) {
    if (err.code === "ERR_MODULE_NOT_FOUND" && i < ext.length) {
      return loadOptions(file, ext, i + 1);
    }
  }
  return {};
}
