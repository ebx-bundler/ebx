import process from "node:process";
import ms from "pretty-ms";
import { rollup } from "rollup";
import { bold, cyan, green } from "./colors";
import { relativeId } from "./path";
import {
  handleError,
  logOnlyInlineSourcemapsForStdout,
  stderr,
} from "./logging";
import { printTimings } from "./timings";
import { RollupOptions } from "./rollup";

export default async function build(
  inputOptions: RollupOptions
): Promise<unknown> {
  const outputOptions = inputOptions.output;
  const useStdout = !outputOptions[0].file && !outputOptions[0].dir;
  const start = Date.now();
  const files = useStdout
    ? ["stdout"]
    : outputOptions.map((t) => relativeId(t.file || t.dir!));
  let inputFiles: string | undefined;
  if (typeof inputOptions.input === "string") {
    inputFiles = inputOptions.input;
  } else if (Array.isArray(inputOptions.input)) {
    inputFiles = inputOptions.input.join(", ");
  } else if (
    typeof inputOptions.input === "object" &&
    inputOptions.input !== null
  ) {
    inputFiles = Object.values(inputOptions.input).join(", ");
  }
  stderr(cyan(`\n${bold(inputFiles!)} → ${bold(files.join(", "))}...`));
  const bundle = await rollup(inputOptions as any);
  if (useStdout) {
    const output = outputOptions[0];
    if (output.sourcemap && output.sourcemap !== "inline") {
      handleError(logOnlyInlineSourcemapsForStdout());
    }
    const { output: outputs } = await bundle.generate(output);
    for (const file of outputs) {
      if (outputs.length > 1)
        process.stdout.write(`\n${cyan(bold(`//→ ${file.fileName}:`))}\n`);
      process.stdout.write(file.type === "asset" ? file.source : file.code);
    }
    return;
  }

  await Promise.all(outputOptions.map(bundle.write));
  await bundle.close();
  stderr(
    green(
      `created ${bold(files.join(", "))} in ${bold(ms(Date.now() - start))}`
    )
  );
  if (bundle && bundle.getTimings) {
    printTimings(bundle.getTimings());
  }
}
