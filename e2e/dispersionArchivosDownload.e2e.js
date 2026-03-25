import {
  afterEach, describe, expect, test, vi,
} from 'vitest';
import { mockDispersionArchivosDownloadResponse, mockUserAutenticado } from './mock/dispersionArchivosDownload.mock.js';
import { api } from './test/setup.js';

const ENDPOINT = '/api/v1/dispersion/archivos/download';

describe('GET /api/v1/dispersion/archivos/download', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Retorna estatus 200 con petición de formato pdf', async () => {
    mockUserAutenticado();
    mockDispersionArchivosDownloadResponse();

    const params = {
      formato: 'pdf',
      ejercicio: '2026',
      quincena: '03',
      banco: 'BANORTE',
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`)
      .set('X-RFC', 'REGA7806045J5')
      .buffer(true);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/pdf');
    expect(response.body).toBeInstanceOf(Buffer);
  });

  test('Retorna estatus 200 con petición de formato excel', async () => {
    mockUserAutenticado();
    mockDispersionArchivosDownloadResponse();

    const params = {
      formato: 'excel',
      ejercicio: '2026',
      quincena: '03',
      banco: 'BANORTE',
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`)
      .set('X-RFC', 'REGA7806045J5')
      .buffer(true);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  test('retorna 400 si la petición no es con un formato excel o pdf', async () => {
    mockUserAutenticado();
    mockDispersionArchivosDownloadResponse();

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
