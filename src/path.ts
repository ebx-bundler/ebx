import { dirname, basename, extname, resolve } from "node:path";
const ABSOLUTE_PATH_REGEX = /^(?:\/|(?:[A-Za-z]:)?[/\\|])/;
const RELATIVE_PATH_REGEX = /^\.?\.(\/|$)/;

const ANY_SLASH_REGEX = /[/\\]/;
export function relative(from: string, to: string): string {
  const fromParts = from.split(ANY_SLASH_REGEX).filter(Boolean);
  const toParts = to.split(ANY_SLASH_REGEX).filter(Boolean);

  if (fromParts[0] === ".") fromParts.shift();
  if (toParts[0] === ".") toParts.shift();

  while (fromParts[0] && toParts[0] && fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }

  while (toParts[0] === ".." && fromParts.length > 0) {
    toParts.shift();
    fromParts.pop();
  }

  while (fromParts.pop()) {
    toParts.unshift("..");
  }

  return toParts.join("/");
}

export function isAbsolute(path: string): boolean {
  return ABSOLUTE_PATH_REGEX.test(path);
}

export function isRelative(path: string): boolean {
  return RELATIVE_PATH_REGEX.test(path);
}

const BACKSLASH_REGEX = /\\/g;

export function normalize(path: string): string {
  return path.replace(BACKSLASH_REGEX, "/");
}

export function getAliasName(id: string): string {
  const base = basename(id);
  return base.slice(0, Math.max(0, base.length - extname(id).length));
}

export function relativeId(id: string): string {
  if (!isAbsolute(id)) return id;
  return relative(resolve(), id);
}

export function isPathFragment(name: string): boolean {
  // starting with "/", "./", "../", "C:/"
  return (
    name[0] === "/" ||
    (name[0] === "." && (name[1] === "/" || name[1] === ".")) ||
    isAbsolute(name)
  );
}

const UPPER_DIR_REGEX = /^(\.\.\/)*\.\.$/;

export function getImportPath(
  importerId: string,
  targetPath: string,
  stripJsExtension: boolean,
  ensureFileName: boolean
): string {
  let relativePath = normalize(relative(dirname(importerId), targetPath));
  if (stripJsExtension && relativePath.endsWith(".js")) {
    relativePath = relativePath.slice(0, -3);
  }
  if (ensureFileName) {
    if (relativePath === "") return "../" + basename(targetPath);
    if (UPPER_DIR_REGEX.test(relativePath)) {
      return [...relativePath.split("/"), "..", basename(targetPath)].join("/");
    }
  }
  return relativePath
    ? relativePath.startsWith("..")
      ? relativePath
      : "./" + relativePath
    : ".";
}
