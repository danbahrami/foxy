const path = require('path');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const request = require('request-promise');
const r = require('request');
const proxy = require('./proxy');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', async (req, res) => {
  const uri = req.path.replace(/^\/foxy\//, '');

  console.log(uri);
  
  return request({ 
    uri,
    resolveWithFullResponse: true,
  }).then(response => {
    const contentType = response.headers['content-type'].split(';')[0];

    switch (contentType) {
      case 'text/html':
        const cleanUri = uri.replace(/\/$/, '').match(/.*:\/\/[^\/]*/)[0];
        const proxied = proxy(response.body, 'https://app.dev.geckoboard.com/foxy/' + cleanUri);
        res.status(200).send(proxied);
        return;
      default:
        r(uri)
        .on('response', function(response) {
          delete response.headers['x-frame-options'];
          delete response.headers['content-security-policy'];
        })
        .pipe(res);
    }
  }).catch(e => {
    res.status(400).send(e);
  });
});

module.exports = app;