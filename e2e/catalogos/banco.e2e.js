import {
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { mockGetBancosResponse } from '../mock/catalogos.mock.js';
import { api } from '../test/setup.js';

vi.resetModules();

const ENDPOINT = '/api/v1/catalogos/bancos';

const getBancos = async () => api.get(ENDPOINT);

describe('GET /api/v1/catalogos/bancos', () => {
  test('Debería retornar estatus 200 sin mandar parámetros', async () => {
    mockGetBancosResponse();

    const response = await getBancos();
    expect(response.status).toBe(200);
  });

  test('Debería retornar error si se envían parámetros para consulta del catálogo', async () => {
    const response = await api.get(`${ENDPOINT}?param=banco123`);
    expect(response.statusCode).toBe(400);
  });
});
