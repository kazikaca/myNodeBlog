var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var config = {
  root: rootPath,
  app: {
    name: 'myNodeblog'
  },
  port: 3000,
  db: 'mongodb://user:pwd@host/database'
};

module.exports = config;
