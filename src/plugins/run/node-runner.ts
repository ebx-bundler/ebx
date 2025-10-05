import { ExecaError, execaNode, type ResultPromise } from "execa";

export function runNode(filename: string, nodeOptions: string[]) {
  let isStopping = false;
  let proc: ResultPromise;

  async function waitForCompletion() {
    proc = execaNode(filename, { nodeOptions, stdio: "inherit" });
    await proc.catch((err) => {
      if (!(err instanceof ExecaError)) {
        throw err;
      }
    });
  }

  const promise = waitForCompletion();

  function stop(signal?: NodeJS.Signals) {
    if (isStopping) {
      return promise;
    }
    isStopping = true;
    proc.kill(signal);
    return promise;
  }
  return stop;
}
