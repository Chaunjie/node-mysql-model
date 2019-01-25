'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Model = function (_Db) {
  _inherits(Model, _Db);

  function Model(props) {
    _classCallCheck(this, Model);

    var _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this, props.tableName));

    _this.props = props.attributes;
    _this.error = {
      status: false,
      msg: ''
    };
    _this.setAttributes = {};
    _this.initMethods();
    return _this;
  }

  _createClass(Model, [{
    key: 'initMethods',
    value: function initMethods() {
      var _this2 = this;

      ['query', 'find', 'save', 'remove', 'queryAll'].forEach(function (r) {
        _this2[r] = function () {
          for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
            props[_key] = arguments[_key];
          }

          return new Promise(function (resolve, reject) {
            _this2.filterMethod(r, props).then(function (res) {
              var _get2;

              (_get2 = _get(Model.prototype.__proto__ || Object.getPrototypeOf(Model.prototype), r, _this2)).call.apply(_get2, [_this2].concat(props)).then(function (res) {
                resolve(res);
              }).catch(function (res) {
                reject(res);
              });
            }).catch(function (res) {
              var error = _this2.error;

              reject({ qerr: error.msg });
            });
          });
        };
      });
    }
  }, {
    key: 'filterMethod',
    value: function filterMethod(r, props) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var error = _this3.error;

        if (r === 'remove') {
          if (error.status) {
            reject();
          } else {
            resolve();
          }
        } else if (r === 'save') {
          if (error.status) {
            reject();
          } else {
            if (props.length) {
              resolve();
            } else {
              _this3.setDefault().then(function (res) {
                resolve();
              });
            }
          }
        } else {
          _this3.error = {
            status: false,
            msg: ''
          };
          resolve();
        }
      });
    }
  }, {
    key: 'setDefault',
    value: function setDefault() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var setAttributes = _this4.setAttributes,
            props = _this4.props;

        var newObj = _extends({}, setAttributes);
        var list = Object.keys(props);
        list.forEach(function (r) {
          if (props[r].hasOwnProperty('default') && !setAttributes.hasOwnProperty(r)) {
            var obj = {};
            obj[r] = props[r].default;
            newObj = Object.assign(newObj, obj);
          }
        });
        _this4.setAttr(newObj);
        resolve();
      });
    }
  }, {
    key: 'set',
    value: function set(values) {
      this.setAttributes = values;
      var status = this.validateType(values);
      if (status) {
        this.error = {
          status: false,
          msg: ''
        };
        this.setAttr(values);
      } else {
        this.error = {
          status: true,
          msg: 'ERROR: key in set has type error'
        };
      }
    }
  }, {
    key: 'validateType',
    value: function validateType(data) {
      var props = this.props;

      var list = Object.keys(data);
      var gettype = Object.prototype.toString;
      return list.reduce(function (prev, next) {
        var typeName = props[next].type.name;
        var typeStatus = gettype.call(data[next]) === '[object ' + typeName + ']';
        return prev && typeStatus;
      }, true);
    }
  }]);

  return Model;
}(_db2.default);

exports.default = Model;