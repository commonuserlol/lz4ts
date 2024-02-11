namespace LZ4 {
    export namespace Utils {
        // Simple hash function, from: http://burtleburtle.net/bob/hash/integer.html.
        // Chosen because it doesn't use multiply and achieves full avalanche.
        export function hashU32(a: number) {
            a = a | 0;
            a = a + 2127912214 + (a << 12) | 0;
            a = a ^ -949894596 ^ a >>> 19;
            a = a + 374761393 + (a << 5) | 0;
            a = a + -744332180 ^ a << 9;
            a = a + -42973499 + (a << 3) | 0;
            return a ^ -1252372727 ^ a >>> 16 | 0;
        }

        // Reads a 64-bit little-endian integer from an array.
        export function readU64(array: Uint8Array, offset: number) {
            var x = 0;
            x |= array[offset++] << 0;
            x |= array[offset++] << 8;
            x |= array[offset++] << 16;
            x |= array[offset++] << 24;
            x |= array[offset++] << 32;
            x |= array[offset++] << 40;
            x |= array[offset++] << 48;
            x |= array[offset++] << 56;
            return x;
        }

        // Reads a 32-bit little-endian integer from an array.
        export function readU32(array: Uint8Array, offset: number) {
            var x = 0;
            x |= array[offset++] << 0;
            x |= array[offset++] << 8;
            x |= array[offset++] << 16;
            x |= array[offset++] << 24;
            return x;
        }

        // Writes a 32-bit little-endian integer from an array.
        export function writeU32(array: Uint8Array, offset: number, data: number) {
            array[offset++] = (data >> 0) & 0xff;
            array[offset++] = (data >> 8) & 0xff;
            array[offset++] = (data >> 16) & 0xff;
            array[offset++] = (data >> 24) & 0xff;
        }

        // Multiplies two numbers using 32-bit integer multiplication.
        // Algorithm from Emscripten.
        export function imul(a: number, b: number) {
            const ah = a >>> 16;
            const al = a & 65535;
            const bh = b >>> 16;
            const bl = b & 65535;
        
            return al * bl + (ah * bl + al * bh << 16) | 0;
        }
    }
}