/* eslint-disable import/no-extraneous-dependencies */
import { vi } from 'vitest';

const originPathQueries = require.resolve(
  '../../src/db/h2h-nomina/queries/archivos.queries.js',
);

const originPathFileManager = require.resolve(
  '../../src/utils/fileManager.js',
);

const originPathAuth = require.resolve(
  '../../src/external-services/auth/auth.service.js',
);

export const mockArchivoExiste = () => {
  require.cache[originPathQueries].exports.getDataByName = vi.fn().mockResolvedValue({
    nombreArchivo: 'NI2005208.PAG',
    archivoEstatusId: 1,
  });
};

export const mockUpdateArchivoOk = () => {
  require.cache[originPathQueries].exports.updateArchivoEstatusTransactional = vi.fn().mockImplementation(async ({ onAfterUpdate }) => {
    if (onAfterUpdate) {
      await onAfterUpdate();
    }
    return 1;
  });
};

export const mockTransferenciaOk = () => {
  require.cache[originPathFileManager].exports.downloadFromSftpStage = vi.fn().mockResolvedValue({
    success: true,
  });

  require.cache[originPathFileManager].exports.uploadToSftpBanorte = vi.fn().mockResolvedValue({ success: true });

  require.cache[originPathFileManager].exports.uploadToSftpStageRespaldo = vi.fn().mockResolvedValue({ success: true });

  require.cache[originPathFileManager].exports.deleteFileFromSftpStage = vi.fn().mockResolvedValue({ success: true });
};

export const mockArchivoInexistente = () => {
  require.cache[originPathQueries].exports.getDataByName = vi.fn().mockResolvedValue(null);
};

export const mockAuthOk = () => {
  require.cache[originPathAuth].exports.getUserAccess = vi.fn().mockResolvedValue({
    success: true,
    data: {
      rol: {
        descripcion: 'ADMINISTRADOR',
      },
    },
  });
};
