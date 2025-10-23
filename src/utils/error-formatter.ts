import { red, yellow, bold, cyan, dim, green } from "./colors";
import type { Message } from "esbuild";

export type LogLevel = "error" | "warn" | "info" | "debug";

let currentLogLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel) {
  currentLogLevel = level;
}

export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

const logLevelPriority: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export function shouldLog(level: LogLevel): boolean {
  return logLevelPriority[level] <= logLevelPriority[currentLogLevel];
}

export function formatError(error: Error | Message[] | string): string {
  if (typeof error === "string") {
    return formatSimpleError(error);
  }

  if (Array.isArray(error)) {
    return formatEsbuildErrors(error);
  }

  return formatNodeError(error);
}

function formatSimpleError(message: string): string {
  return red(`✘ ${message}`);
}

function formatNodeError(error: Error): string {
  const suggestions = getErrorSuggestions(error);

  let output = `
${red(bold("✘ Build Error"))}

${red(error.message)}
`;

  if (suggestions.length > 0 && shouldLog("info")) {
    output += `\n${yellow(bold("💡 Suggestions:"))}\n`;
    suggestions.forEach((suggestion, i) => {
      output += `  ${i + 1}. ${suggestion}\n`;
    });
  }

  if (error.stack && shouldLog("debug")) {
    output += `\n${dim("Stack trace:")}\n${dim(error.stack)}\n`;
  }

  return output;
}

function formatEsbuildErrors(errors: Message[]): string {
  let output = `\n${red(bold(`✘ Build failed with ${errors.length} error(s)`))}\n\n`;

  errors.forEach((error, index) => {
    output += `${red(bold(`Error ${index + 1}:`))}\n`;

    if (error.location) {
      const { file, line, column } = error.location;
      output += `${cyan(`${file}:${line}:${column}`)}\n`;
    }

    output += `${error.text}\n`;

    if (error.detail && shouldLog("debug")) {
      output += `${dim(error.detail)}\n`;
    }

    if (error.notes && error.notes.length > 0 && shouldLog("info")) {
      output += `\n${yellow(bold("Notes:"))}\n`;
      error.notes.forEach((note) => {
        if (note.location) {
          output += `  ${cyan(`${note.location.file}:${note.location.line}:${note.location.column}`)}\n`;
        }
        output += `  ${note.text}\n`;
      });
    }

    output += "\n";
  });

  return output;
}

function getErrorSuggestions(error: Error): string[] {
  const suggestions: string[] = [];
  const message = error.message.toLowerCase();

  // Common error patterns and suggestions
  if (message.includes("cannot find module")) {
    suggestions.push("Make sure the module is installed: npm install <module-name>");
    suggestions.push("Check the import path is correct");
    suggestions.push("Verify the module exists in node_modules");
  }

  if (message.includes("permission denied") || message.includes("eacces")) {
    suggestions.push("Check file permissions");
    suggestions.push("Try running with appropriate permissions");
  }

  if (message.includes("port") && message.includes("already in use")) {
    suggestions.push("Kill the process using the port");
    suggestions.push("Use a different port");
  }

  if (message.includes("syntax error") || message.includes("unexpected token")) {
    suggestions.push("Check for syntax errors in your code");
    suggestions.push("Make sure your tsconfig.json is configured correctly");
  }

  if (message.includes("memory") || message.includes("heap")) {
    suggestions.push("Try increasing Node.js memory limit: NODE_OPTIONS=--max-old-space-size=4096");
    suggestions.push("Check for memory leaks in your code");
  }

  return suggestions;
}

// Log level helpers
export function logError(message: string, error?: Error) {
  if (!shouldLog("error")) return;
  console.error(red(`✘ ${message}`));
  if (error && shouldLog("debug")) {
    console.error(dim(error.stack || error.message));
  }
}

export function logWarn(message: string) {
  if (!shouldLog("warn")) return;
  console.warn(yellow(`⚠ ${message}`));
}

export function logInfo(message: string) {
  if (!shouldLog("info")) return;
  console.log(cyan(`ℹ ${message}`));
}

export function logDebug(message: string, data?: any) {
  if (!shouldLog("debug")) return;
  const timestamp = new Date().toISOString();
  console.log(dim(`[${timestamp}] [DEBUG] ${message}`));
  if (data !== undefined) {
    console.log(dim(JSON.stringify(data, null, 2)));
  }
}

export function logSuccess(message: string) {
  if (!shouldLog("info")) return;
  console.log(green(`✓ ${message}`));
}
