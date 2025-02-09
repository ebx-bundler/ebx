import type { BuildOptions } from "esbuild";
import type { CliOption } from "./command";

export interface NodeExternal {
  include: string[] | "*";
}

export interface EBXConfig
  extends BuildOptions,
    Partial<Omit<CliOption, "sourcemap">> {
  polyfills?: string[];
  inject?: string[];
  nodeExternal?: NodeExternal;
}

export interface ConfigOption extends CliOption {
  nodeExternal?: NodeExternal;
  polyfills: string[];
}
