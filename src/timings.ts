import { bold } from "./colors";
import ms from "pretty-ms";

export function printTimings(start: number) {
  return bold(ms(Date.now() - start));
}
