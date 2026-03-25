/* eslint-disable no-console */
const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('../../src/db/h2h-nomina/connections/sequelize.js');
const { dbAppConfig } = require('../../src/common/config.js');

const umzug = new Umzug({
  migrations: {
    glob: './src/db/h2h-nomina/seeders/*.js',
    resolve: ({ name, path, context }) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context),
        down: async () => migration.down(context),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: console,
});

const upSeed = async () => {
  try {
    const { dbName } = dbAppConfig;
    await sequelize.sync({ force: true, match: new RegExp(`^${dbName}$`) }); // Crear tablas
    await umzug.up();
  } catch (error) {
    console.error(error);
  }
};

const downSeed = async () => {
  const { dbName } = dbAppConfig;
  await sequelize.drop({ match: new RegExp(`^${dbName}$`) }); // Eliminar tablas
};

module.exports = { upSeed, downSeed };
