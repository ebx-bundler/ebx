import { ExecaError, execaNode, type ResultPromise } from "execa";

export function runNode(
  filename: string,
  nodeOptions: string[],
  envVars?: Record<string, string>
) {
  let isStopping = false;
  let proc: ResultPromise;

  async function waitForCompletion() {
    // Merge environment variables (envVars already guaranteed to be strings from dotenv)
    const env = envVars ? { ...process.env, ...envVars } : process.env;

    proc = execaNode(filename, { nodeOptions, stdio: "inherit", env });

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
