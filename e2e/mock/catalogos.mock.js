/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const originPath = require.resolve('../../src/db/h2h-nomina/queries/catalogos.queries.js');

export const mockGetBancosResponse = () => {
  // Incluye valores que requieren formateo y el '01' para verificar el filtrado
  const payload = [
    {
      id: '001',
      nombre: 'Banco Ejemplo Nombre completo',
      nombreCorto: 'Banco Ejemplo',
    },
  ];
  require.cache[originPath].exports.getBancos = vi.fn().mockResolvedValue(payload);
};

export const mockGetEstatusArchivosResponse = () => {
  const payload = [
    { id: 1, clave: 'C', descripcion: 'Cargado' },
    { id: 2, clave: 'V', descripcion: 'Validado' },
    { id: 3, clave: 'E', descripcion: 'Ejecutado' },
    { id: 4, clave: 'Q', descripcion: 'Cancelado' },
  ];
  require.cache[originPath].exports.getEstatusArchivos = vi.fn().mockResolvedValue(payload);
};

export const mockGetBancoError = () => {
  require.cache[originPath].exports.getBancos = vi.fn().mockRejectedValue(new Error('DB error'));
};
