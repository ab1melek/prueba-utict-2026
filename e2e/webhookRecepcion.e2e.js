import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import {
  mockAcuseArchivoExitoso,
  mockArchivosCompletos,
  mockERPTieneRegistros,
  mockModelsTransaction,
  mockNotificacionOk,
  mockProcesamientoArchivosOk,
  mockQueriesRespuestaOk,
} from './mock/webhookRecepcion.mock.js';

import { api } from './test/setup.js';

const ENDPOINT = '/api/v1/archivos/recepcion/callback';

describe('POST /archivos/recepcion/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Debe indicar que el RTP aún no está disponible', async () => {
    mockArchivosCompletos(); // existFile = false

    const response = await api
      .post(ENDPOINT)
      .send({
        topic: 'banorte',
        file: {
          name: 'PI001110520232005307.RTP',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'RTP aún no disponible, esperando...',
    );
  });

  test('Debe procesar los archivos correctamente', async () => {
    mockArchivosCompletos();
    mockProcesamientoArchivosOk();
    mockQueriesRespuestaOk();
    mockAcuseArchivoExitoso();
    mockModelsTransaction();
    mockNotificacionOk();
    mockERPTieneRegistros();

    const response = await api
      .post(ENDPOINT)
      .send({
        topic: 'banorte',
        file: {
          name: 'PI001110520232005207.RTP',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Archivos procesados correctamente',
    );
  });
});
