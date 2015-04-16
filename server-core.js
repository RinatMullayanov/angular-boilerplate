var winston = require('winston'); // logger
var path = require('path');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    }),
    new (winston.transports.File)({
      filename: 'server.log',
      timestamp: function () {
        'use strict';
        return new Date().toLocaleString();
      }
    })
  ]
});

var express = require('express');
var compress = require('compression'); // gzip
var cors = require('cors');
var app = express();

exports.use = function (middleware) {
  app.use(middleware);
};
exports.listen = function (config) {
  try {
    var sitePath = path.join(__dirname, config.siteDir);
    logger.info('sitePath: ' + sitePath);
    app.use(cors()); // Access-Control-Allow-Origin: *

    // setting run status: development or production
    if (config.status === 'dev') {
      logger.info('Server start like [DEV]');
    } else if (config.status === 'production') {
      logger.info('Server start like [PRODUCTION]');
    } else {
      config.status = 'production';
      logger.warn('Server status not defined! Server start like [PRODUCTION]');
    }

    if (config.status === 'production') {

      var cacheTime = 86400000 * 7; // 7 days like ms
      // enable gzip for static
      app.use(compress({
        threshold: 512
      }));
      logger.info('Gzip is enabled.');

      // enable cache
      app.use(express.static(sitePath, {
        maxAge: cacheTime
      }));
      logger.info('Caching is enabled.');
    } else {
      // dev mode
      logger.warn('Gzip is NOT enabled.');
      logger.warn('Caching is NOT enabled.');
      // без кеширования
      app.use(express.static(sitePath));
    }

    // hide information
    app.disable('x-powered-by');

    // request logger
    app.use(function (req, res, next) {
      logger.info(req.connection.remoteAddress + ' req.url: ' + req.url);
      next();
    });

    app.get('*', function (req, res) {
      res.sendFile(sitePath + '/index.html'); // for correct work with Angular.js
    });

    // listen
    app.listen(config.port, function () {
      logger.transports.console.level = 'info';
      logger.info('Server start is listening port: ' + config.port);
      if (config.status === 'production') {
        // less logger level
        logger.transports.console.level = 'error';
      }
    });

  } catch (e) {
    logger.error('Error: ' + e);
  }
};