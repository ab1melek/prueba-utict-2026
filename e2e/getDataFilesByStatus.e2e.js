import {
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { mockgetMetadataFileResponse } from './mock/metadataArchivos.mock.js';
import { api } from './test/setup.js';

vi.resetModules();

const ENDPOINT = '/api/v1/archivos/estatus';
const RFC = 'REGA7806045J5';

describe('GET /api/v1/archivos/estatus', () => {
  test('Debería retornar estatus 200 con un estatus de archivo válido', async () => {
    mockgetMetadataFileResponse();

    const response = await api
      .get(`${ENDPOINT}?estatus=2`)
      .set('X-RFC', RFC);
    expect(response.status).toBe(200);
  });

  test('Debería retornar error si se envían parámetros inválidos', async () => {
    const response = await api
      .get(`${ENDPOINT}?param=123`)
      .set('X-RFC', RFC);
    expect(response.statusCode).toBe(400);
  });

  test('Debería retornar error si no se envían parámetros', async () => {
    const response = await api
      .get(`${ENDPOINT}`)
      .set('X-RFC', RFC);
    expect(response.statusCode).toBe(400);
  });
});
