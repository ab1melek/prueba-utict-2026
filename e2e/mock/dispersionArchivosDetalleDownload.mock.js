/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const queriesPath = require.resolve('../../src/db/h2h-nomina/queries/reporteDetallePagoNomina.queries.js');
const templatePath = require.resolve('../../src/assets/templates/reporteDetallePagoNomina.js');

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
  require.cache[queriesPath].exports.findDetallePagoNomina = vi.fn().mockResolvedValue(detallePagoMock);
  require.cache[templatePath].exports.generatePDF = vi.fn().mockResolvedValue(Buffer.from('PDF_MOCK_DATA'));
  require.cache[templatePath].exports.generateExcel = vi.fn().mockResolvedValue(Buffer.from('EXCEL_MOCK_DATA'));
};

export const mockAuthOk = () => {
  const auth = require('../../src/external-services/auth/auth.service.js');
  vi.spyOn(auth, 'getUserAccess').mockResolvedValue({
    success: true,
    data: { rol: { descripcion: 'ADMINISTRADOR' } },
  });
};
