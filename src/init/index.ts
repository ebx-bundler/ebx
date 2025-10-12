import { defaults } from "../config/defaults";
import { handleError } from "../utils";
import { dumpEBXConfig } from "./ebx";
import { dumpTSConfig } from "./typescript";

export async function handleInit() {
  try {
    await dumpEBXConfig();
  } catch (err) {
    handleError(err);
  }
  try {
    await dumpTSConfig(defaults.tsconfig);
  } catch (err) {
    handleError(err);
  }
}
