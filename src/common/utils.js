const gracefulShutdown = (server) => {
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Server ExpressJS is closed');
    process.exit(0);
  });

  // Forzar cierre del server despues de 5 segundos
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error(
      'Could not close connections in time, forcefully shutting down',
    );
    process.exit(1);
  }, 5000);
};
module.exports = gracefulShutdown;
