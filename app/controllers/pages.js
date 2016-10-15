'use strict';

var _ = require('lodash');
var i18n = require('../config/i18n');
var theme = require('../config/theming');

function getBasePath(config) {
  var result = config.get('basePath');
  if (_.isUndefined(result) || _.isNull(result) || (result == '')) {
    return '';
  }
  result = '' + result;
  if (result.substr(0, 1) != '/') {
    result = '/' + result;
  }
  if (result.substr(-1, 1) == '/') {
    result = result.substr(0, result.length - 1);
  }
  return result;
}

module.exports.main = function(req, res) {
  var config = req.app.get('config');

  var viewFileName = 'pages/' +  (req.view || 'main') + '.html';
  var _t = i18n.init(req.query.lang);

  res.render(viewFileName, {
    title: _t('Open Spending Viewer'),
    basePath: getBasePath(config),
    isEmbedded: req.isEmbedded,
    theme: theme.get(req.query.theme)
  });
};
