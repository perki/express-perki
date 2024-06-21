const path = require('path');
const { getLogger, getConfig } = require('boiler').init({
  appName: `app:${process.pid}`, // This will will be prefixed to any log messages
  baseFilesDir: path.resolve(__dirname, '..'), // use for file:// relative path if not give cwd() will be used
  baseConfigDir: path.resolve(__dirname, '../config')
});

const cluster = require('cluster');
const os = require('os');
const server = require('./server');
const numCPUs = os.cpus().length;

const logger = getLogger('start');

(async () => {
  if (cluster.isMaster) {
    const config = await getConfig();
    logger.info(`Master process ${process.pid} is running`);
    logger.info(`Api is exposed on: ${config.get('baseURL')}`);
    const configNumProcesses = config.get('start:numProcesses') || numCPUs;
    const numProcesses = configNumProcesses < 0 ? Math.max(numCPUs + configNumProcesses, 1) : configNumProcesses;

    for (let i = 0; i < numProcesses; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.info(`Worker process ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    await server.launch();
  }
})();
