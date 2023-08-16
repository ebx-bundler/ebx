# **EBX: Command Line Tool for Building and Running TypeScript Code**

## Introduction

EBX is a command-line tool designed to simplify the process of building and running TypeScript code. It provides a set of options and features to streamline the development workflow, including options for watching changes, generating sourcemaps, running the compiled program, and more.

## Installation

You can install EBX globally using the following command:

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

## Example Usage

1. **Basic Build and Run:**

   To build and run a TypeScript file named `app.ts`, use the following command:

   ```bash
   ebx -r app.ts
   ```

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

## Conclusion

EBX simplifies the process of building and running TypeScript code by providing a command-line interface and a programmable API. Its customizable options make it a versatile tool for various development workflows, and its ability to watch for changes and run the compiled program makes it suitable for both development and testing purposes.
