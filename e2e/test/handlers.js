/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */

const dotenv = require('dotenv');
const { http, HttpResponse } = require('msw');

dotenv.config({ path: '.env' });
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: envFile, override: true });

const AUTH_BASE_URL = process.env.AUTH_BASE_URL || 'https://apis-pruebas.patronato.unam.mx:443/auth-dispersion/1.0.0';

const restHandlers = [
  // Mock para el servicio de autenticación
  http.get(`${AUTH_BASE_URL}/auth/access`, ({ request }) => {
    const url = new URL(request.url);
    const rfc = url.searchParams.get('rfc');

    // Simular diferentes respuestas según el RFC
    if (!rfc) {
      return HttpResponse.json({
        code: '400',
        message: 'Bad Request',
        description: 'RFC es requerido',
      }, { status: 400 });
    }

    // RFC válido con permisos
    if (rfc === 'REGA7806045J5') {
      return HttpResponse.json({
        rfc,
        rol: {
          id: 1,
          descripcion: 'ADMINISTRADOR',
        },
        permisos: ['cargar_archivo', 'consultar_archivo'],
      }, { status: 200 });
    }

    // RFC válido pero sin permisos suficientes
    if (rfc === 'USER1234567A1') {
      return HttpResponse.json({
        rfc,
        rol: {
          id: 3,
          descripcion: 'CONSULTOR',
        },
        permisos: ['consultar_archivo'],
      }, { status: 200 });
    }

    // RFC inválido o sin acceso
    return HttpResponse.json({
      code: '401',
      message: 'Unauthorized',
      description: 'Credenciales incorrectas o sesión expirada',
    }, { status: 401 });
  }),
];

export default restHandlers;
