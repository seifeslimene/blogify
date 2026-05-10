const { config } = require('@blogify/config');

module.exports = {
  siteUrl: config.CLIENT_SITE_URL,
  generateRobotsTxt: true,
};
