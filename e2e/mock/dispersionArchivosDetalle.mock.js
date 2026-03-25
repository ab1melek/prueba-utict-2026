/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const originPath = require.resolve('../../src/db/h2h-nomina/queries/reporteDetallePagoNomina.queries.js');

export const detallePagoMock = [
  {
    tipoCuenta: 'Tarjeta de Débito',
    banco: 'BANORTE',
    cuenta: '072180001234567890',
    importe: '15000.50',
    descripcionPago: 'PAGO DE NÓMINA Q03',
    titular: 'EMPLEADO PRUEBA UNO',
    rechazo: '',
    ejercicio: '2026',
    quincena: '03',
    dependencia: '123',
    subdependencia: '45',
    fechaCarga: new Date('2026-03-06T21:56:30.000Z'),
    estatus: 'EXITOSO',
  },
];

export const mockDetallePagoResponse = () => {
  require.cache[originPath].exports.findDetallePagoNomina = vi.fn().mockResolvedValue(detallePagoMock);
};

export const mockDetallePagoEmptyResponse = () => {
  require.cache[originPath].exports.findDetallePagoNomina = vi.fn().mockResolvedValue([]);
};

export const mockAuthOk = () => {
  const auth = require('../../src/external-services/auth/auth.service.js');
  vi.spyOn(auth, 'getUserAccess').mockResolvedValue({
    success: true,
    data: { rol: { descripcion: 'ADMINISTRADOR' } },
  });
};
