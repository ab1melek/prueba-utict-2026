import {
  describe, expect, test, vi,
} from 'vitest';
import { mockArchivoEncontradoResponse, mockAuthOk, mockSinRegistrosResponse } from './mock/dispersionArchivos.mock.js';
import { api } from './test/setup.js';

vi.resetModules();

const ENDPOINT = '/api/v1/dispersion/archivos';
const params = {
  ejercicio: '2025',
  quincena: '01',
  banco: 'BANORTE',
};

describe('GET /api/v1/dispersion/archivos', () => {
  test('Retorna estatus 200 con parámetros válidos requeridos', async () => {
    mockAuthOk();
    mockArchivoEncontradoResponse();
    const queryString = new URLSearchParams(params).toString();
    const response = await api
      .get(`${ENDPOINT}?${queryString}`)
      .set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(200);
  });

  test('Retorna arreglo vacío cuando no se encuentran archivos de dispersión', async () => {
    mockAuthOk();
    mockSinRegistrosResponse();
    const queryString = new URLSearchParams(params).toString();

    const response = await api
      .get(`${ENDPOINT}?${queryString}`)
      .set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });
});
