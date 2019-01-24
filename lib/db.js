'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pool = {};

var Db = function () {
  function Db(table) {
    _classCallCheck(this, Db);

    this.tableName = table;
    this.attributes = {};
  }

  _createClass(Db, [{
    key: 'escape',
    value: function escape(str) {
      return _mysql2.default.escape(str);
    }
  }, {
    key: 'query',
    value: function query() {
      var sql = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var records = arguments[1];

      return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
          if (err) {
            reject(err);
          } else {
            if (sql) {
              conn.query(sql, records, function (qerr, vals, fields) {
                //释放连接
                conn.release();
                if (qerr) {
                  reject(qerr);
                } else {
                  resolve({ qerr: qerr, vals: vals, fields: fields });
                }
              });
            } else {
              var _err = 'ERROR: query is need';
              reject({ qerr: _err });
            }
          }
        });
      });
    }
  }, {
    key: 'find',
    value: function find() {
      var _this = this;

      var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
      var conditions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
          if (err) {
            reject(err);
          } else {
            var tableName = _this.tableName;

            var qcond = '';
            var fields = '*';
            if (conditions['fields']) {
              fields = conditions['fields'];
            }

            if (conditions['where']) {
              qcond += ' WHERE ' + conditions['where'];
            }

            if (conditions['group']) {
              qcond += ' GROUP BY ' + conditions['group'];
              if (conditions['groupDESC']) {
                qcond += " DESC";
              }
            }

            if (conditions['having']) {
              qcond += ' HAVING ' + conditions['having'];
            }

            if (conditions['order']) {
              qcond += ' ORDER BY ' + conditions['order'];
              if (conditions['orderDESC']) {
                qcond += " DESC";
              }
            }

            if (conditions['limit']) {
              qcond += ' LIMIT ' + conditions['limit'];
            }

            var q = '';
            switch (method) {
              case 'all':
                q = 'select ' + fields + ' from ' + tableName + qcond;
                conn.query(q, function (qerr, vals, fields) {
                  conn.release();
                  if (qerr) {
                    reject(qerr);
                  } else {
                    resolve({ qerr: qerr, vals: vals, fields: fields });
                  }
                });
                break;
              case 'count':
                q = 'select COUNT(*) from ' + tableName + qcond;
                conn.query(q, function (qerr, vals, fields) {
                  conn.release();
                  if (qerr) {
                    reject(qerr);
                  } else {
                    resolve({ qerr: qerr, vals: vals[0]['COUNT(*)'], fields: fields });
                  }
                });
                break;
              case 'first':
                q = 'select ' + fields + ' from ' + tableName + qcond;
                conn.query(q, function (qerr, vals, fields) {
                  conn.release();
                  if (qerr) {
                    reject(qerr);
                  } else {
                    resolve({ qerr: qerr, vals: vals[0], fields: fields });
                  }
                });
                break;
              case 'field':
                q = 'select ' + fields + ' from ' + tableName + qcond;
                conn.query(q, function (qerr, vals, fields) {
                  for (var key in vals[0]) {
                    break;
                  }conn.release();
                  if (qerr) {
                    reject(qerr);
                  } else {
                    resolve({ qerr: qerr, vals: vals, fields: fields });
                  }
                });
                break;
            }
          }
        });
      });
    }
  }, {
    key: 'save',
    value: function save() {
      var _this2 = this;

      var where = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
          if (err) {
            reject(err);
          } else {
            var tableName = _this2.tableName,
                attributes = _this2.attributes;

            var q = '';
            var check = '';
            if (where) {
              q = 'update ' + tableName + ' set ' + _this2.escape(attributes) + ' where ' + where;
              check = 'select * from ' + tableName + ' where ' + where;
              conn.query(check, function (qerr, vals, fields) {
                if (vals[0]) {
                  conn.query(q, function (err, result, field) {
                    conn.release();
                    resolve({ qerr: err, vals: vals, fields: field });
                  });
                } else {
                  var _err2 = 'ERROR: Record not found';
                  reject({ qerr: _err2, vals: vals, fields: fields });
                }
              });
            } else {
              var attrArr = Object.keys(attributes);
              if (attrArr.length) {
                q = 'insert into ' + tableName + ' set ' + _this2.escape(attributes);
                var whereSql = _this2.escape(attributes).replace(/,/ig, ' and');
                check = 'select * from ' + tableName + ' where ' + whereSql;
                conn.query(q, function (qerr, vals, fields) {
                  if (qerr) {
                    conn.release();
                    reject({ qerr: qerr });
                  } else {
                    conn.query(check, function (err, result, field) {
                      if (result[0]) {
                        _this2.clear();
                        conn.release();
                        resolve({ qerr: err, vals: result, fields: field });
                      }
                    });
                  }
                });
              } else {
                var _err3 = 'ERROR: Model has no specified key, delete aborted';
                reject({ qerr: _err3 });
              }
            }
          }
        });
      });
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _this3 = this;

      var where = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
          if (err) {
            reject(err);
          } else {
            var tableName = _this3.tableName,
                attributes = _this3.attributes;

            var q = '';
            var check = '';
            if (where) {
              q = 'delete from ' + tableName + ' where ' + where;
              check = 'select * from ' + tableName + ' where ' + where;
              conn.query(check, function (qerr, vals, fields) {
                if (vals[0]) {
                  conn.query(q, function (err, result, field) {
                    conn.release();
                    resolve({ qerr: err, vals: result, fields: field });
                  });
                } else {
                  conn.release();
                  var _err4 = 'ERROR: Record not found';
                  reject({ qerr: _err4, vals: vals, fields: fields });
                }
              });
            } else {
              var attrArr = Object.keys(attributes);
              if (attrArr.length) {
                var whereSql = _this3.escape(attributes).replace(/,/ig, ' and');
                q = 'delete from ' + tableName + ' where ' + whereSql;
                check = 'select * from ' + tableName + ' where ' + whereSql;
                _this3.clear();
                conn.query(check, function (qerr, vals, fields) {
                  if (vals[0]) {
                    conn.query(q, function (err, result, field) {
                      conn.release();
                      resolve({ qerr: err, vals: result, fields: field });
                    });
                  } else {
                    conn.release();
                    var _err5 = 'ERROR: Record not found';
                    reject({ qerr: _err5, vals: vals, fields: fields });
                  }
                });
              } else {
                var _err6 = 'ERROR: Model has no specified key, delete aborted';
                reject({ qerr: _err6 });
              }
            }
          }
        });
      });
    }
  }, {
    key: 'setAttr',
    value: function setAttr(attr) {
      this.attributes = attr;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.attributes = {};
    }
  }, {
    key: 'saveAll',
    value: function saveAll() {
      var records = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var tableName = this.tableName;

      var list = Object.keys(records[0]);
      var newRecords = records.map(function (r) {
        return list.map(function (d) {
          return r[d];
        });
      });
      var sql = 'insert into ' + tableName + ' (' + list.join(', ') + ') values ?';
      return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
          if (err) {
            reject(err);
          } else {
            if (sql) {
              conn.query(sql, [newRecords], function (qerr, vals, fields) {
                //释放连接
                conn.release();
                if (qerr) {
                  reject(qerr);
                } else {
                  resolve({ qerr: qerr, vals: vals, fields: fields });
                }
              });
            } else {
              var _err7 = 'ERROR: query is need';
              reject({ qerr: _err7 });
            }
          }
        });
      });
    }
  }], [{
    key: 'createPool',
    value: function createPool(options) {
      pool = _mysql2.default.createPool(options);
    }
  }]);

  return Db;
}();

exports.default = Db;