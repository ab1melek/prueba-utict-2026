const originPath = require.resolve('../../src/sambaClient/sambaClient.js');
const sftpPath = require.resolve('../../src/sftpClient/sftpClient.js');
const configPath = require.resolve('../../src/common/config.js');

export const mockUploadToSftpSuccess = () => {
  require.cache[configPath].exports.sftpConfig = {
    sftpHost: 'test-host',
    sftpPort: '22',
    sftpUser: 'test-user',
    sftpPassword: 'test-password',
    sftpPath: '/test/path',
  };

  const mockSftpInstance = {
    connectSFTP: vi.fn().mockResolvedValue(),
    uploadFile: vi.fn().mockResolvedValue(),
  };

  require.cache[sftpPath].exports.getInstance = vi.fn().mockReturnValue(mockSftpInstance);
};

export const mockUploadToSftpError = () => {
  require.cache[configPath].exports.sftpConfig = {
    sftpHost: 'test-host',
    sftpPort: '22',
    sftpUser: 'test-user',
    sftpPassword: 'test-password',
    sftpPath: '/test/path',
  };

  const mockSftpInstance = {
    connectSFTP: vi.fn().mockResolvedValue(),
    uploadFile: vi.fn().mockRejectedValue(new Error('Error de conexión SFTP')),
  };

  require.cache[sftpPath].exports.getInstance = vi.fn().mockReturnValue(mockSftpInstance);
};

export const mockDownloadFileSuccess = () => {
  const fakeFileContent = Buffer.from('contenido del archivo de prueba');
  require.cache[originPath].exports.readFile = vi.fn().mockResolvedValue(fakeFileContent);
};

export const mockDownloadFileError = () => {
  require.cache[originPath].exports.readFile = vi.fn().mockRejectedValue(new Error('Error al leer archivo desde Samba'));
};
