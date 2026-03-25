/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const servicePath = require.resolve('../../src/services/reporteArchivosDispersionNomina.service.js');

export const mockDispersionArchivosDownloadResponse = () => {
  require.cache[servicePath].exports.generarReporteArchivosDispersionNomina = vi
    .fn()
    .mockImplementation(({ formato }) => {
      if (formato === 'pdf') {
        return Promise.resolve(Buffer.from('PDF_MOCK_DATA'));
      }

      if (formato === 'excel') {
        return Promise.resolve(Buffer.from('EXCEL_MOCK_DATA'));
      }

      throw new Error('Formato no soportado');
    });
};

export const mockUserAutenticado = () => {
  const auth = require('../../src/external-services/auth/auth.service.js');

  vi.spyOn(auth, 'getUserAccess').mockResolvedValue({
    success: true,
    data: { rol: { descripcion: 'ADMINISTRADOR' } },
  });
};
