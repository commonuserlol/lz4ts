// xxh32.ts - implementation of xxhash32 in plain TypeScript

namespace LZ4 {
  export namespace Hash {
    // xxhash32 primes
    const prime1 = 0x9e3779b1;
    const prime2 = 0x85ebca77;
    const prime3 = 0xc2b2ae3d;
    const prime4 = 0x27d4eb2f;
    const prime5 = 0x165667b1;

    function rotl32 (x: number, r: number) {
      x = x | 0;
      r = r | 0;
    
      return x >>> (32 - r | 0) | x << r | 0;
    }
    
    function rotmul32 (h: number, r: number, m: number) {
      h = h | 0;
      r = r | 0;
      m = m | 0;
    
      return Math.imul(h >>> (32 - r | 0) | h << r, m) | 0;
    }

    // Utility functions/primitives
    // --

    function shiftxor32 (h: number, s: number) {
      h = h | 0;
      s = s | 0;

      return h >>> s ^ h | 0;
    }

    // Implementation
    // --

    function xxhapply (h: number, src: number, m0: number, s: number, m1: number) {
      return rotmul32(Math.imul(src, m0) + h, s, m1);
    }

    function xxh1 (h: number, src: Uint8Array, index: number) {
      return rotmul32((h + Math.imul(src[index], prime5)), 11, prime1);
    }

    function xxh4 (h: number, src: Uint8Array, index: number) {
      return xxhapply(h, Utils.readU32(src, index), prime3, 17, prime4);
    }

    function xxh16 (h: number[], src: Uint8Array, index: number) {
      return [
        xxhapply(h[0], Utils.readU32(src, index + 0), prime2, 13, prime1),
        xxhapply(h[1], Utils.readU32(src, index + 4), prime2, 13, prime1),
        xxhapply(h[2], Utils.readU32(src, index + 8), prime2, 13, prime1),
        xxhapply(h[3], Utils.readU32(src, index + 12), prime2, 13, prime1)
      ];
    }

    export function xxh32 (seed: number, src: Uint8Array, index: number, len: number) {
      let h: number[] | number;
      let l: number;
      l = len;
      if (len >= 16) {
        h = [
          seed + prime1 + prime2,
          seed + prime2,
          seed,
          seed - prime1
        ];
    
        while (len >= 16) {
          h = xxh16(h, src, index);
    
          index += 16;
          len -= 16;
        }
    
        h = rotl32(h[0], 1) + rotl32(h[1], 7) + rotl32(h[2], 12) + rotl32(h[3], 18) + l;
      } else {
        h = (seed + prime5 + len) >>> 0;
      }
    
      while (len >= 4) {
        h = xxh4(h, src, index);
    
        index += 4;
        len -= 4;
      }
    
      while (len > 0) {
        h = xxh1(h, src, index);
    
        index++;
        len--;
      }
    
      h = shiftxor32(Utils.imul(shiftxor32(Utils.imul(shiftxor32(h, 15), prime2), 13), prime3), 16);
    
      return h >>> 0;
    }
  }
}