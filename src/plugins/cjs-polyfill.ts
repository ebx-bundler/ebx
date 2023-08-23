import type { Plugin } from "esbuild";
export function cjs(): Plugin {
  return {
    name: "cjs-polyfill",
    setup({ onLoad, onResolve, initialOptions }) {
      const namespace = "cjs-polyfill";
      if (!initialOptions.inject) {
        initialOptions.inject = [];
      }
      initialOptions.inject.push("cjs:virtual");
      onResolve({ filter: /^cjs:virtual$/ }, (args) => {
        return {
          path: args.path,
          namespace,
        };
      });
      onLoad({ filter: /.*/, namespace }, () => {
        return {
          loader: "js",
          contents: `import { URL, fileURLToPath } from 'url';
          import { dirname } from 'path';
          import { createRequire } from 'node:module';
          const currentModuleURL = new URL(import.meta.url);
          const currentModulePath = fileURLToPath(currentModuleURL);
          const currentModuleDirname = dirname(currentModulePath);
          globalThis.__filename = currentModulePath;
          globalThis.__dirname = currentModuleDirname;
          globalThis.require = createRequire(import.meta.url);
          `,
        };
      });
    },
  };
}
