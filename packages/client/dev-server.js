const { config } = require('@blogify/config');
const cli = require('next/dist/cli/next-dev');

const port = config.CLIENT_PORT || 3001;

try {
  cli.nextDev(['-p', port]);
  console.log(`[blogify] client has been started, port: ${port}`);
} catch (err) {
  console.log(`[blogify] Client startup failed! ${err.message || err}`);
}
