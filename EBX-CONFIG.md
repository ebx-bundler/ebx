# EBX Configuration Guide

EBX now supports configuration-driven builds using `ebx.config.js` files, while maintaining full backward compatibility with `package.json` configuration.

## Configuration Priority

1. **CLI flags** (highest priority) - Override any config
2. **ebx.config.js** - Project-specific configuration file
3. **package.json** - Legacy configuration (still supported)
4. **Defaults** - Built-in defaults

## Using ebx.config.js

Create an `ebx.config.js` file in your project root:

```javascript
export default {
  // Output directory for compiled files
  outdir: "dist",

  // Output file extension
  outExtension: ".js",

  // Module format: "module" for ESM, "commonjs" for CJS
  type: "module",

  // Polyfills to enable
  polyfills: ["cjs", "decorators"],

  // Node.js version target
  engines: {
    node: ">=18.0.0"
  },

  // Files to inject into the bundle
  inject: [],

  // External module configuration
  external: {
    include: ["lodash"] // Bundle these instead of keeping external
  },

  // Custom loaders for file extensions
  loader: {
    ".graphql": "text",
    ".txt": "text"
  }
};
```

## CLI Override Options

All configuration options can be overridden via command-line flags:

### Output Directory
```bash
ebx app.ts --outdir build
ebx app.ts -o lib
```

### Module Format
```bash
ebx app.ts --format esm
ebx app.ts -f cjs
```

### Polyfills
```bash
ebx app.ts --polyfills cjs decorators
ebx app.ts -p cjs
```

### Target Environment
```bash
ebx app.ts --target node18
ebx app.ts -t node20
```

## Configuration Options

### `outdir`
- **Type:** `string`
- **Default:** `"dist"`
- **Description:** Output directory for compiled files

### `outExtension`
- **Type:** `string`
- **Default:** `".js"`
- **Description:** Output file extension

### `type`
- **Type:** `"module" | "commonjs"`
- **Default:** `"commonjs"`
- **Description:** Module format - "module" for ESM, "commonjs" for CJS

### `polyfills`
- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Polyfills to enable
  - `"cjs"` - Adds `__dirname`, `__filename`, and `require` support in ESM
  - `"decorators"` - Enables TypeScript decorators

### `engines.node`
- **Type:** `string`
- **Default:** `undefined`
- **Description:** Node.js version target (e.g., ">=18.0.0", "20")

### `inject`
- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Files to inject into the bundle

### `external.include`
- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Modules to bundle instead of keeping external (by default all modules are external)

### `loader`
- **Type:** `Record<string, Loader>`
- **Default:** `undefined`
- **Description:** Custom loaders for file extensions

## Examples

### Basic ESM Configuration

```javascript
// ebx.config.js
export default {
  type: "module",
  outdir: "build",
  polyfills: ["cjs"]
};
```

```bash
ebx src/index.ts -r
```

### Override Config with CLI

```javascript
// ebx.config.js
export default {
  type: "commonjs",
  outdir: "dist"
};
```

```bash
# Override to use ESM and different output directory
ebx src/index.ts --format esm --outdir build -r
```

### NestJS Configuration

```javascript
// ebx.config.js
export default {
  type: "module",
  polyfills: ["cjs", "decorators"],
  engines: {
    node: ">=18.0.0"
  }
};
```

### Custom Loaders

```javascript
// ebx.config.js
export default {
  loader: {
    ".graphql": "text",
    ".sql": "text",
    ".html": "text"
  },
  external: {
    include: ["graphql"] // Bundle graphql instead of external
  }
};
```

## Migration from package.json

If you're currently using `package.json` configuration, you can migrate to `ebx.config.js`:

**Before (package.json):**
```json
{
  "name": "my-app",
  "type": "module",
  "main": "lib/app.js",
  "polyfills": ["cjs"],
  "external": {
    "include": ["lodash"]
  }
}
```

**After (ebx.config.js):**
```javascript
export default {
  type: "module",
  outdir: "lib",
  polyfills: ["cjs"],
  external: {
    include: ["lodash"]
  }
};
```

## Backward Compatibility

- Existing projects using `package.json` configuration continue to work without changes
- `ebx.config.js` takes precedence over `package.json` when both exist
- CLI flags always take highest precedence
