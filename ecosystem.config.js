module.exports = {
  apps: [
    {
      name: 'api-rest',
      script: './src/index.js',
      cron_restart: '0 0 * * *',
      out_file: './logs/console.log',
      error_file: './logs/error.log',
      log_date_format: 'DD-MM-YYYY HH:mm:ss Z',
    },
  ],
};
