import {
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { api } from './test/setup.js';

vi.resetModules();

const ENDPOINT = '/api/v1/catalogos/estatus-archivos';

const getEstatusArchivos = async () => api.get(ENDPOINT);

describe('GET /api/v1/catalogos/estatus-archivo', () => {
  test('Debería retornar estatus 200 sin mandar parámetros', async () => {
    const response = await getEstatusArchivos();
    expect(response.status).toBe(200);
  });
});
