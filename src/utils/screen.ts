import { clear, log } from "./logging";

export function getResetScreen(): (heading?: string) => void {
  return (heading) => {
    clear();
    if (heading) {
      log(heading);
    }
  };
}
