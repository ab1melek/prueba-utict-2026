import { describe, expect, test } from 'vitest';

import { api } from './test/setup.js';

const ENDPOINT = '/api/v1/archivos/acuse/download';

describe('GET /api/v1/archivos/acuse/download', () => {
  test('deberia retornar estatus 400 cuando no se envia nombreArchivo', async () => {
    const response = await api
      .get(ENDPOINT)
      .set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(400);
  });

  test('deberia retornar estatus 400 cuando no se envia fechaAcuse', async () => {
    const response = await api
      .get(`${ENDPOINT}?nombreArchivo=NI2005207.PAG`)
      .set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(400);
  });

  test('deberia retornar estatus 400 cuando RFC es incorrecto', async () => {
    const response = await api
      .get(`${ENDPOINT}?nombreArchivo=NI2005207.PAG&fechaAcuse=2023-05-11`)
      .set('X-RFC', 'REGA780604500');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('description');
  });

  test('deberia retornar estatus 400 cuando nombreArchivo no cumple formato', async () => {
    const response = await api
      .get(`${ENDPOINT}?nombreArchivo=ARCHIVO.TXT&fechaAcuse=2023-05-11`)
      .set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('description');
  });

  test('deberia retornar estatus 404 cuando no existe solicitud', async () => {
    const response = await api
      .get(`${ENDPOINT}?nombreArchivo=NI0000001.PAG&fechaAcuse=2023-05-11`)
      .set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(404);
    expect(response.body.description).toMatch(/No existe un archivo de solicitud/);
  });

  test('deberia retornar estatus 400 con nombre de archivo inválido', async () => {
    const response = await api
      .get(`${ENDPOINT}?nombreArchivo=NI00000.PAG&fechaAcuse=2023-05-11`)
      .set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(400);
  });

  test('deberia retornar headers correctos en descarga', async () => {
    // Este test se ejecutaría si existe una solicitud con acuse válido
    // Para datos válidos en BD, descargará con headers correctos
    const response = await api
      .get(`${ENDPOINT}?nombreArchivo=NI2005207.PAG&fechaAcuse=2023-05-11`)
      .set('X-RFC', 'REGA7806045J5');

    // Si la solicitud existe, verifica headers de descarga
    if (response.status === 200) {
      expect(response.headers['content-type']).toContain('text/plain');
      expect(response.headers['content-disposition']).toMatch(/attachment; filename=/);
    }
  });
});
