import { ExecaError, execaNode, type ResultPromise } from "execa";

export function runNode(filename: string, nodeOptions: string[]) {
  let isStopping = false;
  let proc: ResultPromise;
  const promise = new Promise<void>(async (resolve) => {
    proc = execaNode(filename, { nodeOptions, stdio: "inherit" });
    await proc.catch((err) => {
      if (!(err instanceof ExecaError)) {
        throw err;
      }
    });
    resolve();
  });

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
