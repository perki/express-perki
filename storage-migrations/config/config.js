const path = require('path');
const fs = require('fs');
const { getConfig } = require('boiler').init({
  appName: 'sequelize-cli', // This will will be prefixed to any log messages
  baseFilesDir: path.resolve(__dirname, '../../'), // use for file:// relative path if not give cwd() will be used
  baseConfigDir: path.resolve(__dirname, '../../config')
});

// mock sequelize expected settings
// just return current env in the array and rely on boiler for choosing
async function dbConfig () {
  const config = await getConfig();
  const dbSettings = config.get('storage:main');
  let sequelizeCliSettings;
  if (dbSettings.engine === 'sqlite') { // test and dev
    const dbFilePath = path.resolve(path.resolve(__dirname, '../../'), dbSettings.sqliteFilePath || 'storage/db.sqlite');
    fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
    sequelizeCliSettings = {
      storage: dbFilePath,
      dialect: 'sqlite'
    };
  } else { // postgres (maybe others)
    sequelizeCliSettings = {
      username: dbSettings.username,
      password: dbSettings.password || null,
      database: dbSettings.database,
      host: dbSettings.host || 'localhost',
      dialect: dbSettings.engine
    };
  }
  const env = process.env.NODE_ENV || 'development';
  return { [env]: sequelizeCliSettings };
}

module.exports = dbConfig;
