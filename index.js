'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = exports.model = undefined;

var _model = require('./lib/model');

var _model2 = _interopRequireDefault(_model);

var _db = require('./lib/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.model = _model2.default;
exports.db = _db2.default;