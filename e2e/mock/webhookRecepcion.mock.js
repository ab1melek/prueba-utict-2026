/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const pathSftp = require.resolve(
  '../../src/sftpClient/sftpBanorteClient.js',
);

const pathRTLService = require.resolve(
  '../../src/services/rtlFileExtraction.service.js',
);

const pathArchivoRespuesta = require.resolve(
  '../../src/services/archivoRespuestaSinExtension.service.js',
);

const pathArchivoERP = require.resolve(
  '../../src/services/archivoRespuestaERP.service.js',
);

const pathQueries = require.resolve(
  '../../src/db/h2h-nomina/queries/archivosRespuesta.queries.js',
);

const pathNotifications = require.resolve(
  '../../src/services/notifications.service.js',
);

const pathModels = require.resolve(
  '../../src/db/index.js',
);

const pathServicioWebHook = require.resolve(
  '../../src/services/recepcionWebhook.service.js',
);

/* export const mockArchivosIncompletos = () => {
  const sftpModule = require.cache[pathSftp];
  if (sftpModule?.exports) {
    sftpModule.exports.existFile = vi.fn().mockResolvedValue(false);
  }
}; */
export const mockArchivosIncompletos = () => {
  const sftpModule = require.cache[pathServicioWebHook];
  if (sftpModule?.exports) {
    sftpModule.exports.existeArchivoEnRecepcion = vi.fn().mockResolvedValue(true);
  }
};

export const mockArchivosCompletos = () => {
  const sftpModule = require.cache[pathSftp];
  if (sftpModule?.exports) {
    sftpModule.exports.existFile = vi.fn().mockResolvedValue(true);
  }
};

export const mockProcesamientoArchivosOk = () => {
  // Import el módulo real y spy on la función
  const rtlModule = require(pathRTLService);
  vi.spyOn(rtlModule, 'extractRTLFile').mockResolvedValue({
    success: true,
    message: 'Se descargó el archivo exitosamente',
    file: {
      fileName: 'test.RTP',
      localPath: '/tmp/test.RTP',
      remotePath: '/recepcion/test.RTP',
      dbRecordId: 1,
      uploaded: true,
    },
  });

  // Mock ArchivoRespuestaService - mockeamos el método procesar del prototipo
  const respuestaModule = require(pathArchivoRespuesta);
  respuestaModule.prototype.procesar = vi
    .fn()
    .mockResolvedValue(true);

  // Mock ArchivoERPService - mockeamos el método procesar del prototipo
  const erpModule = require(pathArchivoERP);
  erpModule.prototype.procesar = vi
    .fn()
    .mockResolvedValue(true);
};

export const mockQueriesRespuestaOk = () => {
  const queriesModule = require.cache[pathQueries];
  if (queriesModule?.exports) {
    queriesModule.exports.getDataByName = vi.fn().mockResolvedValue({
      id: 1,
    });

    queriesModule.exports.getNominaPagoSolicitudDetallesByIdFile = vi
      .fn()
      .mockResolvedValue({
        ejercicio: '23',
        quincena: '05',
      });
  }
};

export const mockNotificacionOk = () => {
  const notifyModule = require.cache[pathNotifications];
  if (notifyModule?.exports) {
    notifyModule.exports.successNotification = vi
      .fn()
      .mockResolvedValue(true);
  }
};

export const mockModelsTransaction = () => {
  const mockTransaction = {
    commit: vi.fn().mockResolvedValue(undefined),
    rollback: vi.fn().mockResolvedValue(undefined),
  };
  const modelsModule = require.cache[pathModels];
  if (modelsModule?.exports?.sequelize) {
    modelsModule.exports.sequelize.transaction = vi
      .fn()
      .mockResolvedValue(mockTransaction);
  }
};

export const mockAcuseArchivoExitoso = () => {
  const queriesModule = require.cache[pathQueries];
  if (queriesModule?.exports) {
    queriesModule.exports.getNominaPagoRespuestaAcuseArchivo = vi
      .fn()
      .mockResolvedValue({
        resultadoValidacion: 'EXITOSO',
      });
  }
};

export const mockERPTieneRegistros = () => {
  const service = require(pathServicioWebHook);
  vi.spyOn(service, 'erpTieneRegistros').mockResolvedValue(true);
};

export const mockERPSinRegistros = () => {
  const service = require(pathServicioWebHook);
  vi.spyOn(service, 'erpTieneRegistros').mockResolvedValue(false);
};
