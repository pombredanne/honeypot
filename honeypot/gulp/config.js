'use strict';

module.exports = {

  'serverport': 8081,

  'scripts': {
    'src': './dev/scripts/**/*.js*',
    'dest': './honeypot/www/static/honeypot/scripts/'
  },

  'images': {
    'src': './dev/images/**/*.{jpeg,jpg,png}',
    'dest': './honeypot/wwww/static/honeypot/images/'
  },

  'styles': {
    'src': './dev/styles/*.scss',
    'dest': './honeypot/www/static/honeypot/styles/'
  },

  'html': {
    'src': './dev/*.html',
    'dest': './honeypot/www/templates/honeypot/'
  },

  'sourceDir': './dev/',
  'buildDir': './honeypot/www/static/honeypot',
};
