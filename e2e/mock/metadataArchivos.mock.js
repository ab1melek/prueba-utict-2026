/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const originPath = require.resolve('../../src/db/h2h-nomina/queries/archivos.queries.js');

export const getMetadataFileOkMock = [
  {
    nombreArchivo: 'NI2020777.PAG',
    totalRegistros: 520,
    montoTotal: 456800.23,
    id: '101',
    fechaProceso: '2024-06-15',
    fechaPago: '2024-06-15',
    banco: {
      id: 10,
      nombre: 'BANORTE',
    },
  },
];

export const mockgetMetadataFileResponse = () => {
  require.cache[originPath].exports.getDataByStatus = vi.fn().mockResolvedValue(getMetadataFileOkMock);
};
