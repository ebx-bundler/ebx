import { glob } from "glob";
import esbuild from "esbuild";
import { execaNode } from "execa";
import type { Config } from "../config/types";
import { logInfo, logSuccess, logError, logDebug } from "../utils/error-formatter";
import { debugTime } from "../utils/debug";
import { join } from "node:path";
import { mkdirSync } from "node:fs";

export async function runTests(config: Config): Promise<void> {
  const endTimer = debugTime("Test run");

  logInfo("Running tests...");

  // Find test files
  const pattern = config.testPattern || "**/*.test.{ts,js}";
  logDebug(`Looking for test files: ${pattern}`);

  const testFiles = await glob(pattern, {
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  if (testFiles.length === 0) {
    logError(`No test files found matching pattern: ${pattern}`);
    return;
  }

  logInfo(`Found ${testFiles.length} test file(s)`);

  // Build test files
  const testOutDir = join(config.outdir, ".test");
  mkdirSync(testOutDir, { recursive: true });

  try {
    logDebug("Building test files...");

    await esbuild.build({
      entryPoints: testFiles,
      bundle: true,
      platform: "node",
      target: config.target || "node18",
      format: config.format,
      outdir: testOutDir,
      sourcemap: config.sourcemap,
      tsconfig: config.tsconfig,
      external: ["node:*"],
    });

    logSuccess("Test files built");

    // Run each test file
    let passedTests = 0;
    let failedTests = 0;

    for (const testFile of testFiles) {
      const testName = testFile.replace(/\.(ts|js)$/, ".js");
      const testPath = join(testOutDir, testName);

      try {
        logInfo(`Running: ${testFile}`);

        await execaNode(testPath, {
          stdio: "inherit",
          nodeOptions: config.nodeOptions,
        });

        passedTests++;
        logSuccess(`Passed: ${testFile}`);
      } catch (error) {
        failedTests++;
        logError(`Failed: ${testFile}`);
      }
    }

    // Summary
    console.log("\n" + "─".repeat(50));
    if (failedTests === 0) {
      logSuccess(`All ${passedTests} test(s) passed!`);
    } else {
      console.log(`Tests: ${passedTests} passed, ${failedTests} failed, ${testFiles.length} total`);
      process.exit(1);
    }

  } catch (error) {
    logError("Failed to build test files", error as Error);
    throw error;
  } finally {
    endTimer();
  }
}
