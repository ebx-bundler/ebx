import { red } from "../colors";
import { defaults } from "../config/defaults";
import { stderr } from "../logging";
import { dumpEBXConfig } from "./ebx";
import { dumpTSConfig } from "./typescript";

export async function handleInit() {
  try {
    await dumpEBXConfig();
  } catch (err) {
    if (err instanceof Error) {
      stderr(red("✘ " + err.message));
    } else {
      stderr(err);
    }
  }
  try {
    await dumpTSConfig(defaults.tsconfig);
  } catch (err) {
    if (err instanceof Error) {
      stderr(red("✘ " + err.message));
    } else {
      stderr(err);
    }
  }
}
