const { getLogger, getConfig } = require('boiler');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const logger = getLogger('storage');
const { applyModel } = require('./model');
const ShortUniqueId = require('short-unique-id');

let User;
let sequelize;

module.exports = {
  init,
  createUser,
  userForEmail,
  userForId
};

async function init () {
  if (sequelize != null) throw new Error('Storage already initialized');
  const sequelizeLogger = logger.getLogger('sequelize');
  function sequelizeDebug (msg) {
    sequelizeLogger.debug(msg);
  }
  const config = (await getConfig()).get('storage:main');
  if (config.engine === 'sqlite') { // test and dev
    const dbFilePath = path.resolve(path.resolve(__dirname, '../../'), config.sqliteFilePath || 'storage/db.sqlite');
    fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbFilePath,
      logging: sequelizeDebug
    });
  } else { // postgres
    const url = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
    sequelize = new Sequelize(url, {
      dialect: 'postgres',
      logging: sequelizeDebug
    });
  }

  ({ User } = await applyModel(sequelize));
  try {
    await sequelize.authenticate();
    await User.findOne({});
  } catch (e) {
    if (e.message === 'SQLITE_ERROR: no such table: users' ||
        e.message === 'relation "users" does not exist'
    ) {
      throw new Error('DataBase not initialized, run "npm run init:db"');
    } else {
      console.log('******', e);
      throw e;
    }
  }

  logger.info('Connection has been established successfully.');
}

// ----- users ------ //

async function createUser (params) {
  if (params.name.length < 1) throw new Error('User name too short');
  const userId = await getNewId(User, 'u');
  const userSafe = {
    userId,
    name: params.name,
    email: params.email
  };
  return User.create(userSafe);
}

async function userForEmail (email) {
  const user = await User.findOne({ where: { email } });
  return user;
}

async function userForId (userId) {
  const user = await User.findOne({ where: { userId } });
  return user;
}

// ------------------ utils ---------------------- //

const sid = new ShortUniqueId({ dictionary: 'alphanum_lower', length: 8 });
async function getNewId (Model, startWith = 'x') {
  for (let i = 0; i < 1000; i++) {
    const id = startWith + sid.rnd();
    const res = await Model.findByPk(id);
    if (res === null) return id;
  }
  throw new Error('Was not able to genreate an Id after 1000 attemps');
}
