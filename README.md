# EBX: A Tool for Building and Running TypeScript Code

**An extremely fast bundler for the Node.js**

## Introduction

EBX is specifically designed for **NodeJS** backend development, serving as a versatile and powerful tool for bundling/running TypeScript code. It provides a hassle-free experience for developers and [asynchronous type checking](#performance-and-asynchronous-type-checking) without any configuration needed.

## Getting Started

To get started with EBX, you can follow these simple steps:

1. **Installation**: Install EBX using npm or yarn. Detailed installation instructions can be found in the [Installation](#installation) section.
2. **Usage**: Learn how to use EBX to bundle your TypeScript and JavaScript code. See the [Usage](#usage) section for examples and guidelines.
3. **Integration**: Integrate EBX with your Node.js frameworks, such as NestJS and ExpressJS. Instructions can be found in the [Integration](#integrations) section.

## Features

### Zero Config Required

EBX is designed to work out of the box with minimal setup. You can start using it with zero configuration, saving you time and effort.

### Support for ES Modules (ESM)

It includes CommonJS polyfills for ES Modules (ESM), making it suitable for modern NodeJS development. [ES Modules](#es-modules)

### Performance and Asynchronous Type Checking

EBX is built on top of [ESBuild](https://esbuild.github.io/) and is faster than most other bundlers, including tsc and babel.

Offloads type checking to a child process, enabling asynchronous type checking. This means you can continue working on your code without interruptions while EBX takes care of type checking in the background.

### Watch and Run

No need for **nodemon** or **ts-node**; EBX offers a watch mode that keeps an eye on changes in your source files. Whenever it detects file modifications, it automatically rebuilds and runs the program.

### Bundling

It will exclusively bundle the code you've authored, excluding any external modules, resulting in a slightly faster startup time for your application.

## Installation

To install EBX, use npm or yarn:

```bash
npm install -D ebx
# or
yarn add -D ebx
```

or install globally

```bash
npm install -g ebx
# or
yarn global add ebx
```

Once installed, you can use the `ebx` command globally.

This command will bundle your TypeScript or JavaScript code, automatically handle type checking, and generate the output in the specified configuration.

For practical examples and advanced usage scenarios, please visit the [Examples](#examples) section in the documentation.

## Usage

After installing EBX, you can use it from the command line as follows:

```bash
ebx <filename> [options]
```

Where `<filename>` is the name of the TypeScript file you want to build and run.

### Options

- `-w, --watch`: Watch for changes in the source files and automatically rebuild when changes are detected.
- `-r, --run [filename]`: Run the compiled program after a successful build.
- `-nc, --no-clean`: Do not clean the build output directory before building.
- `-s, --sourcemap`: Generate sourcemaps for the compiled JavaScript code.
- `--tsconfig <tsconfig>`: Path to a custom TypeScript configuration file (tsconfig.json).
- `-m, --minify`: Minify the output JavaScript code.
- `--ignore-types`: Ignore type errors.
- `-no, --node-options <options>`: Add node options to runner.
- `--kill-signal <signal>`: Specify the signal that will be sent to the program before restarting it. Default: `SIGTERM`.
- `-ng, --no-grace`: This option forces the program to be abruptly terminated without any graceful shutdown procedure and then immediately restarted.

## Examples

1. **Basic Build and Run:**

   To build and run a TypeScript file named `app.ts`, use the following command:

   ```bash
   ebx app.ts -r
   ```

   To enable ES Modules (ESM), add `"type": "module"` to your `package.json` file.

2. **Watching Changes:**

   To watch for changes in the `app.ts` file and automatically rebuild and run it when changes occur:

   ```bash
   ebx app.ts -w -r
   ```

3. **Custom Typescript Configuration:**

   To use a custom TypeScript configuration file named `tsconfig.custom.json` and generate sourcemaps:

   ```bash
   ebx app.ts -s --tsconfig tsconfig.custom.json -r
   ```

4. **Minification:**

   To enable minification building and running `app.ts`:

   ```bash
   ebx app.ts -m
   ```

## ES Modules

Have you explored working with ES modules in Node.js using TypeScript? It can sometimes be cumbersome, like adding `.js` when importing `.ts` files

and transforming CommonJS imports as `import { a } from "pkg";` to `import pkg from "pkg"; const { a } = pkg;`

This is where EBX comes into action.

To transpile your code into ES module syntax, add the `"type": "module"` configuration to your `package.json` file.

When working with ESM, you may come across compatibility issues like the absence of `require`, `__filename`, and `__dirname`. To resolve these issues, consider using `cjs` polyfills.

- Learn more [about Polyfills](#polyfills)
- For further information on ESM (ECMAScript Modules) support for Node.js, check out the [Node.js ESM Documentation](https://nodejs.org/en/docs/es6).
- Advantages of ES Modules over CommonJS [ES Modules and CommonJS: An Overview](https://dev.to/costamatheus97/es-modules-and-commonjs-an-overview-1i4b)

## Configuration

No external `rc` files are required; we automatically include existing configuration files like `package.json` and `tsconfig` for configuring your project.

Here's an example of how it can be set up within your `package.json`:

```json
{
  "name": "awesome-app", // package name
  "main": "lib/app.js", // outdir: lib
  "type": "module", // Produces ES Module output
  "polyfills": ["cjs", "nestjs"], // Enable __dirname support in ES modules and activate decorators for NestJS
  "external": {
    "include": ["lodash"] // Included lodash in the compiled bundle.
  },
  "loader": {
    ".graphql": "text" // Load graphql as text file.
  }
}
```

Here’s a refactored version of the documentation for clarity and consistency:

---

### Importing Loader Script

To import the loader script in your project, use the following command:

```bash
ebx ./src/index.ts --import=./src/loader.ts -wr
```

After running the above command, the final output will look like this:

```bash
node --import=./dist/loader.js ./dist/index.js
```

---

This version provides clear instructions and separates the code from the explanation for better readability. Let me know if you’d like any additional details or formatting changes!

### Polyfills

in `package.json`:

```json
"polyfills": ["cjs"]
```

By adding this configuration, you ensure that the specified polyfills are loaded when your ESM code runs, addressing compatibility issues related to `__filename`, `require` and `__dirname`.

#### Available polyfills

1. `cjs` - to add cjs
2. `decorators` - enable ts decorators
3. `nestjs` - enable nestjs support (decorators and more)

### Output Directory

By default, EBX outputs the compiled JavaScript code to the `dist` directory. You can change the output directory by defining the `"main"` field in your package.json file.

ex: `"main": "lib/app.js"` it will now compile and run `app.js` in `lib` directory

### External

All modules will be treated as external and won't be bundled. If you want to include them, add the following to your `package.json`.

```json
   "external": {
      "include": ["lodash"]
   }
```

Now, lodash will be included in the compiled bundle.

## Integrations

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
     },
     "polyfills": ["nestjs"]
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

- [EBX Example ExpressJS with PNP](https://github.com/ebx-bundler/ebx-example-express-pnp)

Harness the power of EBX to bundle and optimize your Node.js backend applications built with NestJS, ExpressJS or any other.

## Conclusion

EBX is a powerful tool that can help you simplify the process of bundling and optimizing JavaScript code for Node.js applications. It is a versatile tool that can be used for both development and production environments.

## License

EBX is released under the [MIT License](https://opensource.org/licenses/MIT). You can find the full license text in the project repository.

## Contributing

We welcome contributions from the community. If you would like to contribute to EBX, please follow the guidelines in the [Contributing](#contributing) section.

Thank you for choosing EBX! If you have any questions or need assistance, feel free to reach out to our support team or visit our website for more information and resources. Happy coding!

[GitHub Repository](https://github.com/ebx-bundler/ebx)
