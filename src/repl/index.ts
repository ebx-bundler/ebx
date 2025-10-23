import repl from "node:repl";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import esbuild from "esbuild";
import { cyan, green, dim } from "../utils/colors";
import type { Config } from "../config/types";

export async function startRepl(config: Config): Promise<void> {
  console.log(cyan("\n🚀 EBX TypeScript REPL"));
  console.log(dim("Type .help for commands, .exit to quit\n"));

  const replServer = repl.start({
    prompt: green("> "),
    eval: createEvalFunction(config),
    writer: (output) => {
      if (output === undefined) return dim("undefined");
      return output;
    },
  });

  // Add custom commands
  replServer.defineCommand("load", {
    help: "Load and execute a TypeScript file",
    action: async function (file: string) {
      try {
        const fullPath = join(process.cwd(), file);
        const code = readFileSync(fullPath, "utf-8");

        const result = await transpileAndEval(code, config);
        console.log(result);
      } catch (error) {
        console.error(
          `Error loading file: ${error instanceof Error ? error.message : error}`
        );
      }
      this.displayPrompt();
    },
  });

  replServer.defineCommand("config", {
    help: "Show current EBX configuration",
    action: function () {
      console.log(config);
      this.displayPrompt();
    },
  });

  replServer.defineCommand("clear", {
    help: "Clear the REPL screen",
    action: function () {
      console.clear();
      this.displayPrompt();
    },
  });

  // Load project context if available
  try {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf-8")
    );
    console.log(
      dim(`Loaded project: ${packageJson.name || "unnamed"}\n`)
    );
  } catch {
    // No package.json found
  }
}

function createEvalFunction(config: Config) {
  return async function (
    code: string,
    _context: any,
    _filename: string,
    callback: (err: Error | null, result: any) => void
  ) {
    try {
      // Check if it's a TypeScript-specific syntax
      const isTypeScript =
        code.includes(":") ||
        code.includes("interface") ||
        code.includes("type ") ||
        code.includes("<");

      if (isTypeScript) {
        const result = await transpileAndEval(code, config);
        callback(null, result);
      } else {
        // Use default JavaScript eval
        try {
          const result = eval(code);
          callback(null, result);
        } catch (error) {
          callback(error as Error, null);
        }
      }
    } catch (error) {
      callback(error as Error, null);
    }
  };
}

async function transpileAndEval(code: string, config: Config): Promise<any> {
  try {
    const result = await esbuild.transform(code, {
      loader: "ts",
      target: config.target || "node18",
      format: config.format,
      tsconfigRaw: config.tsconfig
        ? readFileSync(config.tsconfig, "utf-8")
        : undefined,
    });

    return eval(result.code);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`TypeScript compilation failed: ${error.message}`);
    }
    throw error;
  }
}
