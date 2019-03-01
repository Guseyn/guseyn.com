(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Unit =
/*#__PURE__*/
function () {
  function Unit(elm) {
    _classCallCheck(this, Unit);

    this.elm = elm;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.getOwnPropertyNames(Object.getPrototypeOf(this))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var propertyName = _step.value;

        if (this[propertyName] instanceof Function && this[propertyName] !== 'constructor' && propertyName.startsWith('on')) {
          this.elm[propertyName] = this[propertyName].bind(this);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  _createClass(Unit, [{
    key: "override",
    value: function override(unit, methodName, method) {
      unit.elm[methodName] = method.bind(this);
    }
  }]);

  return Unit;
}();

module.exports = Unit;

},{}],2:[function(require,module,exports){
"use strict";

module.exports = {
  Unit: require('./Unit')
};

},{"./Unit":1}],3:[function(require,module,exports){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('@page-libs/unit'),
    Unit = _require.Unit;

var DayNightButton =
/*#__PURE__*/
function (_Unit) {
  _inherits(DayNightButton, _Unit);

  function DayNightButton(elm) {
    _classCallCheck(this, DayNightButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(DayNightButton).call(this, elm));
  }

  _createClass(DayNightButton, [{
    key: "onclick",
    value: function onclick() {
      var localStyle = localStorage.getItem('localStyle') || 'day';

      if (localStyle === 'night') {
        localStorage.setItem('localStyle', 'day');
      } else {
        localStorage.setItem('localStyle', 'night');
      }

      location.reload();
    }
  }]);

  return DayNightButton;
}(Unit);

module.exports = DayNightButton;

},{"@page-libs/unit":2}],4:[function(require,module,exports){
'use strict';

var DayNightButton = require('./DayNightButton');
/* eslint-disable no-new */


window.onload = function () {
  var localStyle = localStorage.getItem('localStyle') || 'day';

  if (localStyle === 'night') {
    document.documentElement.classList.toggle('night');
  }

  new DayNightButton(document.getElementById('day-night'));
};

},{"./DayNightButton":3}]},{},[3,4]);
