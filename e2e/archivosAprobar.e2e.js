import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import {
  mockArchivoExiste,
  mockArchivoInexistente,
  mockAuthOk,
  mockTransferenciaOk,
  mockUpdateArchivoOk,
} from './mock/aprobarArchivo.mock.js';
import { api } from './test/setup.js';

vi.resetModules();

const ENDPOINT = '/api/v1/archivos/aprobar';

describe('POST /api/v1/archivos/aprobar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthOk();
    mockArchivoExiste();
    mockUpdateArchivoOk();
    mockTransferenciaOk();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Debe regresar error si el archivo no existe', async () => {
    mockArchivoInexistente();

    const response = await api.post(ENDPOINT)
      .set('X-RFC', 'REGA7806045J5')
      .send({
        nombreArchivo: 'NI0000000.PAG',
        aprobar: true,
      });
    expect(response.status).toBe(500);
  });
});
