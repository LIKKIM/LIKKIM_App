// utils/parseDeviceCode.js

/**
 * parseDeviceCodes the given array using a modified TEA algorithm.
 *
 * @param {Uint32Array} v - An array containing two 32-bit unsigned integers.
 * @param {Uint32Array} k - An array containing four 32-bit unsigned key integers.
 */
export function parseDeviceCode(v, k) {
  let v0 = v[0] >>> 0,
    v1 = v[1] >>> 0,
    sum = 0xc6ef3720 >>> 0,
    i;
  const delta = 0x9e3779b9 >>> 0;
  const k0 = k[0] >>> 0,
    k1 = k[1] >>> 0,
    k2 = k[2] >>> 0,
    k3 = k[3] >>> 0;

  for (i = 0; i < 32; i++) {
    v1 -= (((v0 << 4) >>> 0) + k2) ^ (v0 + sum) ^ (((v0 >>> 5) >>> 0) + k3);
    v1 >>>= 0;
    v0 -= (((v1 << 4) >>> 0) + k0) ^ (v1 + sum) ^ (((v1 >>> 5) >>> 0) + k1);
    v0 >>>= 0;
    sum -= delta;
    sum >>>= 0;
  }
  v[0] = v0 >>> 0;
  v[1] = v1 >>> 0;
}
