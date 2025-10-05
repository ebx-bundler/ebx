/**
 * @type {import('ebx').Config}
 */
export default {
  outdir: "dist",
  outExtension: ".js",
  type: "module",
  polyfills: ["cjs"],
  inject: [],
  external: {
    include: ["lodash"],
  },
  loader: {
    ".graphql": "text",
    ".txt": "text",
    ".html": "text",
  },
};
