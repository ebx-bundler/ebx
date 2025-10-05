import { stderr } from "./logging";
import { red } from "./colors";

export function handleError(err: unknown): void {
  if (err instanceof Error) {
    stderr(red("✘ " + err.message));
  } else {
    stderr(err);
  }
}
