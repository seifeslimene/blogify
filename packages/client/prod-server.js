const { config } = require('@blogify/config');
const cli = require('next/dist/cli/next-start');

const port = config.CLIENT_PORT || 3001;

try {
  cli.nextStart(['-H', '127.0.0.1', '-p', String(port)]);
  console.log(`[blogify] client has been started, port: ${port}`);
} catch (err) {
  console.log(`[blogify] Client startup failed! ${err.message || err}`);
}
