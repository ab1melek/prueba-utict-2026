/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const originPath = require.resolve('../../src/services/reporteArchivosDispersionNomina.service.js');

export const archivoDispersionMock = [
  {
    folio: '10008000',
    archivo: 'NI10022077.PAG',
    numeroRegistros: 7,
    importe: 7.77,
    fechaOperacion: '2026-02-11',
    fechaCarga: '2026-02-10',
    fechaPago: '2026-02-10',
    fechaValidacion: '2026-02-10',
    fechaEnvio: '2026-02-10',
    fechaAcuse: '2026-02-10',
    fechaResultados: '2026-02-10',
    estatus: 'Ejecutado',
  },
];

export const mockArchivoEncontradoResponse = () => {
  require.cache[originPath].exports.getArchivosDispersionNominaData = vi.fn().mockResolvedValue(archivoDispersionMock);
};

export const mockSinRegistrosResponse = () => {
  require.cache[originPath].exports.getArchivosDispersionNominaData = vi.fn().mockResolvedValue([]);
};

export const mockAuthOk = () => {
  const auth = require('../../src/external-services/auth/auth.service.js');
  vi.spyOn(auth, 'getUserAccess').mockResolvedValue({
    success: true,
    data: { rol: { descripcion: 'ADMINISTRADOR' } },
  });
};
