function proxy(html, url) {
  var cheerio = require('cheerio');
  var $ = cheerio.load(html);
  var content = '';

  var base = '<base href=\'' + url + '\' />\n';
  $('head').append(base);

  $('img[src^="public"]').each(function() {
    $(this).attr('href', url + '/' + $(this).attr('href'));
  });

  $('a:not([href^="http://"])' +
    ':not([href^="https://"])' +
    ':not([href^="//"])' +
    ':not([href^="javascript:"])')
    .each(function() {
      $(this).attr('href', url + $(this).attr('href'));
  });

  $('img:not([src^="http://"])' +
    ':not([src^="https://"])' +
    ':not([src^="//"])')
    .each(function() {
      if ($(this).attr('src')) {
        $(this).attr('src', url + $(this).attr('src'));
      }
  });

  $('img:not([srcset^="http://"])' +
    ':not([srcset^="https://"])' +
    ':not([srcset^="//"])')
    .each(function() {
      if ($(this).attr('srcset')) {
        $(this).attr('srcset', url + $(this).attr('srcset'));
      }
  });

  $('link:not([href^="http://"])' +
    ':not([href^="https://"])' +
    ':not([href^="//"])')
    .each(function() {
      $(this).attr('href', url + $(this).attr('href'));
  });

  $('script[src]:not([src^="http://"])' +
    ':not([src^="https://"])' +
    ':not([src^="//"])')
    .each(function() {
      $(this).attr('src', url + $(this).attr('src'));
    });

  var mavenjs = '<script id="dev"></script>\n';
  $('a').each(function() {
    $(this).attr('href', 'https://app.dev.geckoboard.com/foxy/' + $(this).attr('href'));
  });

  $('body').append(mavenjs);

  return $.html();
};

module.exports = proxy;