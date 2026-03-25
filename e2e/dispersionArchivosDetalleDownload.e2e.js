import {
  afterEach, describe, expect, test, vi,
} from 'vitest';
import { mockAuthOk, mockDetallePagoResponse } from './mock/dispersionArchivosDetalleDownload.mock.js';
import { api } from './test/setup.js';

const ENDPOINT = '/api/v1/dispersion/archivos/detalle/download';

describe('GET /api/v1/dispersion/archivos/detalle/download', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('retorna PDF cuando se solicita formato pdf', async () => {
    mockAuthOk();
    mockDetallePagoResponse();

    const params = {
      formato: 'pdf',
      ejercicio: '2026',
      quincena: '03',
      banco: 'BANORTE',
      numeroEmpleado: '123456',
      estatus: 'EXITOSO',
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`)
      .set('X-RFC', 'REGA7806045J5')
      .buffer(true);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/pdf');
    expect(response.body).toBeInstanceOf(Buffer);
  });

  test('retorna EXCEL cuando se solicita formato excel', async () => {
    mockAuthOk();
    mockDetallePagoResponse();

    const params = {
      formato: 'excel',
      ejercicio: '2026',
      quincena: '03',
      banco: 'BANORTE',
      numeroEmpleado: '123456',
      estatus: 'EXITOSO',
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`)
      .set('X-RFC', 'REGA7806045J5')
      .buffer(true);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  test('retorna 400 cuando falta X-RFC en headers', async () => {
    mockDetallePagoResponse();

    const params = {
      formato: 'pdf',
      ejercicio: '2026',
      quincena: '03',
      banco: 'BANORTE',
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('retorna 400 cuando formato es inválido', async () => {
    mockAuthOk();
    mockDetallePagoResponse();

    const params = {
      formato: 'xml',
      ejercicio: '2026',
      quincena: '03',
      banco: 'BANORTE',
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`).set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
