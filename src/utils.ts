interface Data {
  [key: string]: any;
}
export function ensureCase<T extends Data>(data: T, ...args: (keyof T)[]): T {
  for (const name of args) {
    if (!data[name]) {
      continue;
    }
    data[name] = data[name].toLowerCase();
  }
  return data;
}
