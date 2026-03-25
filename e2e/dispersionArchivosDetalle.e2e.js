import { describe, expect, test } from 'vitest';
import { detallePagoMock, mockAuthOk, mockDetallePagoResponse } from './mock/dispersionArchivosDetalle.mock.js';
import { api } from './test/setup.js';

const ENDPOINT = '/api/v1/dispersion/archivos/detalle';

describe('GET /api/v1/dispersion/archivos/detalle', () => {
  test('retorna 200 y un solo registro para filtro por numeroEmpleado', async () => {
    mockAuthOk();
    mockDetallePagoResponse();

    const params = {
      ejercicio: '2026',
      quincena: '03',
      banco: 'BANORTE',
      numeroEmpleado: '123456',
      limit: '10',
      offset: '0',
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`).set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('count', 1);
    expect(Array.isArray(response.body.data)).toBe(true);

    const item = response.body.data[0];
    expect(item).toHaveProperty('tipoCuenta', detallePagoMock[0].tipoCuenta);
    expect(item).toHaveProperty('banco', detallePagoMock[0].banco);
    expect(item).toHaveProperty('cuenta', detallePagoMock[0].cuenta);
    expect(item).toHaveProperty('importe', detallePagoMock[0].importe);
    expect(item).toHaveProperty('descripcionPago', detallePagoMock[0].descripcionPago);
    expect(item).toHaveProperty('titular', detallePagoMock[0].titular);
    expect(item).toHaveProperty('ejercicio', detallePagoMock[0].ejercicio);
    expect(item).toHaveProperty('quincena', detallePagoMock[0].quincena);
    expect(item).toHaveProperty('estatus', detallePagoMock[0].estatus);
  });
});
