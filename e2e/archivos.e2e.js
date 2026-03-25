import { describe, expect, test } from 'vitest';

import { api } from './test/setup.js';

const ENDPOINT = '/api/v1/archivos/cargar';

describe('GET /api/v1/archivos/cargar', () => {
  const params = {
    nombreArchivo: 'NI2005202.PAG',
    bancoId: '012',
    fechaOperacion: '2026-01-06',
    fechaPago: '2026-01-10',
    observaciones: 'Prueba',
  };

  test('debería retornar estatus 200 con al enviar todos los paremetros', async () => {
    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`).set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nombreArchivo', params.nombreArchivo);
    expect(response.body).toHaveProperty('numeroRegistros', 377);
    expect(response.body).toHaveProperty('importeTotal', 3.77);
    expect(response.body).toHaveProperty('fechaOperacion', params.fechaOperacion);
    expect(response.body).toHaveProperty('fechaPago', params.fechaPago);
    expect(response.body).toHaveProperty('banco', 'BBVA, S.A., Institución de Banca Múltiple, Grupo Financiero BBVA');
    expect(response.body).toHaveProperty('folio');
    expect(response.body.folio).toMatch(/^\d+$/);
    expect(response.body).toHaveProperty('observaciones', params.observaciones);
  });

  test('debería retornar estatus 409 si el archivo ya fue cargado previamente', async () => {
    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`).set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('description');
    expect(response.body.description).toMatch(/ya fue cargado previamente/);
  });

  test('debería retornar estatus 400 si el RFC no es enviado', async () => {
    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('description', 'request/headers must have required property \'x-rfc\'');
  });

  test('debería retornar estatus 400 si el RFC es incorrecto o no tiene permisos', async () => {
    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`).set('X-RFC', 'REGA780604500');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('description', 'Credenciales incorrectas o sesión expirada');
  });

  test('debería retornar estatus 400 si el archivo tiene errores', async () => {
    const queryString = new URLSearchParams({
      ...params,
      nombreArchivo: 'NI2005201.PAG',
    }).toString();

    const response = await api.get(`${ENDPOINT}?${queryString}`).set('X-RFC', 'REGA7806045J5');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('description', 'El archivo contiene errores de validación');
    expect(response.body).toHaveProperty('rowDetails');

    expect(Array.isArray(response.body.rowDetails)).toBe(true);
    response.body.rowDetails.forEach((row) => {
      expect(row).toHaveProperty('rowNumber');
      expect(row).toHaveProperty('rowDetail');
    });
  });
});
