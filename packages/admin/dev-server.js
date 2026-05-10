const { config } = require('@blogify/config');
const cli = require('next/dist/cli/next-dev');

const port = config.ADMIN_PORT || 3002;

try {
  cli.nextDev(['-p', port]);
  console.log(`[blogify] Management terminal has been started, port: ${port}`);
} catch (err) {
  console.log(`[blogify] Management terminal failed to start! ${err.message || err}`);
}
