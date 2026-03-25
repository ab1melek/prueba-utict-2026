/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const originPath = require.resolve('../../src/sambaClient/sambaClient.js');

const fakeHeaderContent = 'HNE123450020250410020003770000000000003770000000000000000000000000000000000000000000000000000000000823621336'
  + '                                                           \n';

export const mockGetNombresCorrectos = () => {
  const fakeOutputOk = `
  NI1234508.PAG                       N       10  Tue Dec  9 01:16:47 2025
  NI1234509.PAG                       N       10  Tue Dec  9 23:05:54 2025
  `;

  require.cache[originPath].exports.listFiles = vi.fn().mockResolvedValue(fakeOutputOk);
  require.cache[originPath].exports.readFile = vi.fn().mockResolvedValue(fakeHeaderContent);
};

export const mockGetNombresIncorrectos = () => {
  const fakeOutputIncorrecto = `
  NI123450X.PAG                       N       10  Tue Dec  9 01:16:47 2025
  NI123450901.PAG                       N       10  Tue Dec  9 23:05:54 2025
  NX1234508.PAG                       N       10  Tue Dec  9 23:05:54 2025
  NI1234509.XLS                       N       10  Tue Dec  9 23:05:54 2025
  `;

  require.cache[originPath].exports.listFiles = vi.fn().mockResolvedValue(fakeOutputIncorrecto);
};

export const mockGetNombresArchivosError = () => {
  require.cache[originPath].exports.listFiles = vi.fn().mockRejectedValue(new Error('Samba error'));
};
