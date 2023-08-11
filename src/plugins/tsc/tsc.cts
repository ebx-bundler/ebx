export const tscPath = () => {
  process.env.NODE_OPTIONS = `--experimental-import-meta-resolve ${process.env.NODE_OPTIONS}`;
  return import.meta.resolve!("typescript") + "/lib/tsc.js";
};
