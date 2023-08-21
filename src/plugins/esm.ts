import type { Plugin } from "esbuild";

export function esm(): Plugin {
  return {
    name: "esm",
    setup({ onLoad, onResolve, initialOptions }) {
      if (!initialOptions.inject) {
        initialOptions.inject = [];
      }
      initialOptions.inject.push("polyfill:esm");
      onResolve({ filter: /^polyfill:esm$/ }, (args) => {
        return {
          path: args.path,
          namespace: "esm-polyfill",
        };
      });
      onLoad({ filter: /.*/, namespace: "esm-polyfill" }, () => {
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
