const { config } = require('@blogify/config');
const cli = require('next/dist/cli/next-start');

const port = config.ADMIN_PORT || 3002;

try {
  cli.nextStart(['-H', '127.0.0.1', '-p', String(port)]);
  console.log(`[blogify] Management terminal has been started, port: ${port}`);
} catch (err) {
  console.log(`[blogify] Management terminal failed to start! ${err.message || err}`);
}
