const { config } = require('@blogify/config');
const cli = require('next/dist/cli/next-start');

const port = config.ADMIN_PORT || 3002;

try {
  cli.nextStart(['-p', port]);
  console.log(`[blogify] Management terminal has been started, port: ${port}`);
} catch (err) {
  console.log(`[blogify] Management terminal failed to start! ${err.message || err}`);
}
