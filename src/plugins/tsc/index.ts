import { execaNode as node } from "execa";
import { type Plugin } from "esbuild";
import { tscPath } from "./tsc.cjs";
import { Transform, type TransformCallback } from "node:stream";

export function tscForkPlugin(): Plugin {
  return {
    name: "ts-type-check",
    async setup() {
      const p = tscPath();
      console.log({ p });
      const subprocess = node(p, ["--noEmit", "--watch", "--pretty"], {
        shell: true,
        stderr: process.stderr,
        stdin: process.stdin,
      });
      subprocess.stdout?.pipe(new Strip()).pipe(process.stdin);
    },
  };
}

class Strip extends Transform {
  clearBuf = Buffer.from("\x1Bc");
  infoBuf = Buffer.from("[\x1B[90m");
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    if (this.skip(chunk)) {
      return callback();
    }
    this.push(chunk, encoding);
    callback();
  }
  skip(chunk: Buffer) {
    if (this.clearBuf.equals(chunk)) {
      return true;
    }
    if (this.buffersStartWith(chunk, this.infoBuf)) {
      return true;
    }
    return false;
  }
  buffersStartWith(buffer1: Buffer, buffer2: Buffer) {
    if (buffer1.length < buffer2.length) {
      return false;
    }
    for (let i = 0; i < buffer2.length; i++) {
      if (buffer1[i] !== buffer2[i]) {
        return false;
      }
    }
    return true;
  }
}
