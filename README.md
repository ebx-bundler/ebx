# **EBX: for Building and Running TypeScript Code**

## Introduction

**EBX** stands for ES Module Build and Execute and works well with CommonJS (CJS).

**EBX** is a powerful tool designed to simplify the process of building and running TypeScript code within a Node.js environment. With a focus on ECMAScript Modules (ESM), **EBX** streamlines the development workflow, automating essential tasks while requiring zero configuration from developers.

**EBX** takes advantage of the lightning-fast build tool [esbuild](https://esbuild.github.io/) as its foundation.

The standout feature of **EBX** is its parallel type checking mechanism. Unlike traditional methods that halt the development process until type checking completes, our approach offloads type checking to a child process. This asynchronous approach frees developers to continue working on their code without interruptions.

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

Modern JavaScript development often involves utilizing **ES6** module syntax, which provides a more organized and efficient way to structure and manage code dependencies. To facilitate this, Node.js introduced support for ES Modules _(ESM)_ in its ecosystem. By default, Node.js uses CommonJS (CJS) module syntax, but with the addition of the `"type": "module"` field in the package.json, it will transpile codes into ESM syntax.

###

Default output directory is `dist`, if you want to change to something else define main in `package.json`
ex: `"main": "lib/app.js"` it will now compile and run `app.js` in `lib` directory

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

EBX simplifies the process of building and running TypeScript code by providing a command-line interface. Its customizable options make it a versatile tool for various development workflows, and its ability to watch for changes and run the compiled program makes it suitable for both development and testing purposes.
