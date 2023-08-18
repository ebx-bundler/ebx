import { type Plugin } from "esbuild";
import { Transform, type TransformCallback } from "node:stream";
import { tsc } from "../../tsc";
import { EOL } from "node:os";

export function tscForkPlugin(): Plugin {
  return {
    name: "ts-type-check",
    async setup() {
      const subprocess = tsc({ watch: true });
      subprocess.pipe(new Strip()).pipe(process.stdin);
    },
  };
}

class Strip extends Transform {
  clearBuf = Buffer.from("\x1Bc");
  infoBuf = Buffer.from("[\x1B[90m");
  _transform(
    chunks: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const splitted = this.splitChunks(chunks);
    for (const chunk of splitted) {
      if (this.skip(chunk)) {
        continue;
      }
      this.push(chunk, encoding);
    }
    callback();
  }
  skip(chunk: Buffer) {
    if (this.clearBuf.equals(chunk) || chunk.equals(Buffer.from(EOL))) {
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

  *splitChunks(chunk: Buffer) {
    let lineStart = 0;
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === 10) {
        yield chunk.subarray(lineStart, i + 1);
        lineStart = i + 1;
      }
    }
    if (lineStart < chunk.length) {
      yield chunk.subarray(lineStart);
    }
  }
}
