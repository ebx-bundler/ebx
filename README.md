# **EBX: A Tool for Building and Running TypeScript Code**

## Introduction

EBX is a command-line tool that simplifies the process of building and running TypeScript code. It is designed to work with ECMAScript Modules (ESM) and takes advantage of the lightning-fast build tool esbuild: https://esbuild.github.io/.

### Features

- Supports ES Modules (ESM) by default.
- Asynchronous type checking: EBX offloads type checking to a child process, so you can continue working on your code without interruptions.
- Watch mode: EBX can watch for changes in your TypeScript files and automatically rebuild and run the program when changes are detected.
- Can be used to bundle both TypeScript and JavaScript code.
- Provides a variety of options to customize the bundling process, such as minification, sourcemaps, and tree shaking.
- Can be integrated with popular Node.js frameworks, such as NestJS and ExpressJS.

**EBX** stands for ES Module Build and Execute and works well with CommonJS (CJS).

## Installation

You can install **EBX** globally using the following command:

```bash
npm install -g ebx
```

## Usage

After installing EBX, you can use it from the command line as follows:

```bash
ebx [options] <filename>
```

Where `<filename>` is the name of the TypeScript file you want to build and run.

## Options

EBX provides several options that you can use to customize the build and run process:

- `-w, --watch`: Watch for changes in the source files and automatically rebuild when changes are detected.
- `-r, --run`: Run the compiled program after a successful build.
- `-nc, --no-clean`: Do not clean the build output directory before building.
- `-s, --sourcemap`: Generate sourcemaps for the compiled JavaScript code.
- `--tsconfig <tsconfig>`: Path to a custom TypeScript configuration file (tsconfig.json).
- `-m, --minify`: Minify the output JavaScript code.
- `--ignore-types`: Ignore type errors.

## Example Usage

1. **Basic Build and Run:**

   To build and run a TypeScript file named `app.ts`, use the following command:

   ```bash
   ebx -r app.ts
   ```

   To build ES Modules _(ESM)_
   just add `"type": "module"` in your `package.json` file

2. **Watching Changes:**

   To watch for changes in the `app.ts` file and automatically rebuild and run it when changes occur:

   ```bash
   ebx -w -r app.ts
   ```

3. **Custom Configuration:**

   To use a custom TypeScript configuration file named `tsconfig.custom.json` and generate sourcemaps:

   ```bash
   ebx -s --tsconfig tsconfig.custom.json -r app.ts
   ```

4. **Minification:**

   To enable minification building and running `app.ts`:

   ```bash
   ebx -m app.ts
   ```

### ES Modules

EBX supports ES Modules by default. To use ES Modules in your project, simply add the `"type": "module"` field to your package.json file.

## Polyfills for ESM Compatibility

When working with ECMAScript Modules (ESM), you might encounter compatibility issues, such as `require`, `__filename` and `__dirname` not being defined.

To address these you can use a polyfill.

### Adding Polyfills

To add the necessary polyfills for ESM compatibility, follow these steps:

1. Open your `package.json` file.

2. Inside the JSON structure, add a key named `"polyfills"` and specify an array of polyfill names. In this case, we're using `"cjs"` to include CommonJS-related polyfills.

   ```json
   "polyfills": ["cjs"]
   ```

By adding this configuration, you ensure that the specified polyfills are loaded when your ESM code runs, addressing compatibility issues related to `__filename`, `require` and `__dirname`.

#### Available polyfills

1. `cjs` - to add cjs
2. `decorators` - enable ts decorators

### Output Directory

By default, EBX outputs the compiled JavaScript code to the `dist` directory. You can change the output directory by defining the `"main"` field in your package.json file.

ex: `"main": "lib/app.js"` it will now compile and run `app.js` in `lib` directory

### Externals

every modules will be considered as external and it won't bundle, if you want to include

add following in `package.json`

```json
   "external": {
      "include": ["lodash"]
   }
```

now lodash will be include in the compiled bundle.

### Integration with NestJS

#### Step 1: Installation

To integrate EBX with your NestJS project, follow these steps:

1. Install EBX as a development dependency using the following command:

   ```bash
   yarn add -D ebx
   ```

#### Step 2: Configuration

1. Add the following scripts to your `package.json` file:

   ```json
   {
     "scripts": {
       "start:dev": "ebx src/main.ts --watch --run --sourcemap",
       "build": "ebx src/main.ts"
     }
   }
   ```

   > note: decorators are partially supported, if you want full support for decorators, enable `decorators` polyfill.

2. Update `tsconfig.json` file:

   ```json
   {
     "compilerOptions": {
       "moduleResolution": "Bundler",
       "module": "ESNext"
     }
   }
   ```

   - The `start:dev` script uses EBX to watch the `src/main.ts` file, run the development server, and generate source maps for debugging purposes.
   - The `build` script uses EBX to build your project.

3. If you want to use ES modules (ESM), ensure that you have `"type": "module"` in your `package.json` file.

#### Step 3: Example

For a practical example of integrating EBX with NestJS, you can refer to the following GitHub repository:

- [EBX Example NestJS](https://github.com/ebx-bundler/ebx-example-nestjs)

### Integration with ExpressJS

[EBX Example ExpressJS with PNP](https://github.com/ebx-bundler/ebx-example-express-pnp)

Harness the power of EBX to bundle and optimize your Node.js backend applications built with NestJS, ExpressJS or any other.

## Conclusion

EBX is a powerful tool that can help you simplify the process of bundling and optimizing JavaScript code for Node.js applications. It is a versatile tool that can be used for both development and production environments.
