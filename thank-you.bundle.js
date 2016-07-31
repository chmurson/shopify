webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _paymentStatusToShowI;
	
	var _jquery = __webpack_require__(5);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _envConfig = __webpack_require__(112);
	
	__webpack_require__(113);
	
	var _payU = __webpack_require__(114);
	
	var _messages = __webpack_require__(116);
	
	var messages = _interopRequireWildcard(_messages);
	
	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj.default = obj;return newObj;
	  }
	}
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	  } else {
	    obj[key] = value;
	  }return obj;
	} /**
	   * Created by wpiat on 03.07.2016.
	   */
	
	var checkout_token = Shopify.checkout.token;
	//const checkout_token = "0975fe6fc798dc6ef50b0ee4b9ac494a";
	
	processOrder();
	
	function processOrder() {
	  (0, _payU.startOrderFetching)(checkout_token).then(showOrderInfo).catch(infoServerError).then(turnOffDefaultLoadingScreen);
	}
	
	var paymentStatusToShowInfo = (_paymentStatusToShowI = {}, _defineProperty(_paymentStatusToShowI, undefined, createdInfo), _defineProperty(_paymentStatusToShowI, _payU.paymentStatuses.CREATED, createdInfo), _defineProperty(_paymentStatusToShowI, _payU.paymentStatuses.PENDING, pendingInfo), _defineProperty(_paymentStatusToShowI, _payU.paymentStatuses.WAITING_FOR_CONFIRMATION, waitForConfirmationInfo), _defineProperty(_paymentStatusToShowI, _payU.paymentStatuses.REJECTED, rejectedInfo), _defineProperty(_paymentStatusToShowI, _payU.paymentStatuses.CANCELED, canceledInfo), _defineProperty(_paymentStatusToShowI, _payU.paymentStatuses.COMPLETED, completedInfo), _paymentStatusToShowI);
	
	/**
	 * @param {Order} order
	 */
	function showOrderInfo(order) {
	  if (hasOrderAnError()) {
	    return infoSomeError();
	  }
	  if (order.cancelled_at) {
	    return; //do nothing order is cancelled
	  }
	  if (order.isPayU === false) {
	    return; //do nothing if it's not PayU
	  }
	  var infoAction = paymentStatusToShowInfo[order.status];
	  infoAction.call();
	}
	
	/**
	 * ACTIONS
	 */
	function infoSomeError() {
	  Shopify.Checkout.OrderStatus.addContentBox(messages.createSomeError());
	}
	function infoServerError() {
	  Shopify.Checkout.OrderStatus.addContentBox(messages.createServerError());
	}
	function createdInfo() {
	  var url = getPayUStartUrl(checkout_token);
	  Shopify.Checkout.OrderStatus.addContentBox(messages.createCreatedMessage(url));
	
	  (0, _jquery2.default)('#navigate-to-payu').on('click', function () {
	    window.clearTimeout(timer); //to prevent duplication of requests
	  });
	  var timer = setTimeout(function () {
	    location.href = url;
	  }, 5000);
	}
	function rejectedInfo() {
	  Shopify.Checkout.OrderStatus.addContentBox(messages.createRejectedMessage());
	}
	function completedInfo() {
	  Shopify.Checkout.OrderStatus.addContentBox(messages.createCompletedMessage());
	}
	function pendingInfo() {
	  Shopify.Checkout.OrderStatus.addContentBox(messages.createPendingMessage());
	}
	function canceledInfo() {
	  Shopify.Checkout.OrderStatus.addContentBox(messages.createCanceledMessage());
	}
	function waitForConfirmationInfo() {
	  Shopify.Checkout.OrderStatus.addContentBox(messages.createWaitingForConfirmationMessage());
	}
	/**
	 * ACTIONS END
	 */
	
	/**
	 * turn off default css loading screen
	 */
	function turnOffDefaultLoadingScreen() {
	  (0, _jquery2.default)('.page--thank-you .main__content > .section > .section__content').addClass('loaded');
	}
	
	/**
	 * @param order
	 * @returns {boolean}
	 */
	function hasOrderAnError() {
	  var questionMarkPos = location.href.indexOf('?');
	  if (questionMarkPos === -1) {
	    return false;
	  }
	  var params = _jquery2.default.deparam(location.href.slice(questionMarkPos + 1));
	  if (!params || params.error !== "true") {
	    return false;
	  }
	  return true;
	}
	
	function getPayUStartUrl(checkout_token) {
	  return _envConfig.BACKEND_URL + '/order-payu-start/' + checkout_token;
	}

/***/ },

/***/ 113:
/***/ function(module, exports, __webpack_require__) {

	(function(deparam){
	    if (true) {
	        try {
	            var jquery = __webpack_require__(5);
	        } catch (e) {
	        }
	        module.exports = deparam(jquery);
	    } else if (typeof define === 'function' && define.amd){
	        define(['jquery'], function(jquery){
	            return deparam(jquery);
	        });
	    } else {
	        var global;
	        try {
	          global = (false || eval)('this'); // best cross-browser way to determine global for < ES5
	        } catch (e) {
	          global = window; // fails only if browser (https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives)
	        }
	        global.deparam = deparam(global.jQuery); // assume jQuery is in global namespace
	    }
	})(function ($) {
	    var deparam = function( params, coerce ) {
	        var obj = {},
	        coerce_types = { 'true': !0, 'false': !1, 'null': null };
	
	        // Iterate over all name=value pairs.
	        params.replace(/\+/g, ' ').split('&').forEach(function(v){
	            var param = v.split( '=' ),
	            key = decodeURIComponent( param[0] ),
	            val,
	            cur = obj,
	            i = 0,
	
	            // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
	            // into its component parts.
	            keys = key.split( '][' ),
	            keys_last = keys.length - 1;
	
	            // If the first keys part contains [ and the last ends with ], then []
	            // are correctly balanced.
	            if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
	                // Remove the trailing ] from the last keys part.
	                keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );
	
	                // Split first keys part into two parts on the [ and add them back onto
	                // the beginning of the keys array.
	                keys = keys.shift().split('[').concat( keys );
	
	                keys_last = keys.length - 1;
	            } else {
	                // Basic 'foo' style key.
	                keys_last = 0;
	            }
	
	            // Are we dealing with a name=value pair, or just a name?
	            if ( param.length === 2 ) {
	                val = decodeURIComponent( param[1] );
	
	                // Coerce values.
	                if ( coerce ) {
	                    val = val && !isNaN(val) && ((+val + '') === val) ? +val        // number
	                    : val === 'undefined'                       ? undefined         // undefined
	                    : coerce_types[val] !== undefined           ? coerce_types[val] // true, false, null
	                    : val;                                                          // string
	                }
	
	                if ( keys_last ) {
	                    // Complex key, build deep object structure based on a few rules:
	                    // * The 'cur' pointer starts at the object top-level.
	                    // * [] = array push (n is set to array length), [n] = array if n is
	                    //   numeric, otherwise object.
	                    // * If at the last keys part, set the value.
	                    // * For each keys part, if the current level is undefined create an
	                    //   object or array based on the type of the next keys part.
	                    // * Move the 'cur' pointer to the next level.
	                    // * Rinse & repeat.
	                    for ( ; i <= keys_last; i++ ) {
	                        key = keys[i] === '' ? cur.length : keys[i];
	                        cur = cur[key] = i < keys_last
	                        ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
	                        : val;
	                    }
	
	                } else {
	                    // Simple key, even simpler rules, since only scalars and shallow
	                    // arrays are allowed.
	
	                    if ( Object.prototype.toString.call( obj[key] ) === '[object Array]' ) {
	                        // val is already an array, so push on the next value.
	                        obj[key].push( val );
	
	                    } else if ( {}.hasOwnProperty.call(obj, key) ) {
	                        // val isn't an array, but since a second value has been specified,
	                        // convert val into an array.
	                        obj[key] = [ obj[key], val ];
	
	                    } else {
	                        // val is a scalar.
	                        obj[key] = val;
	                    }
	                }
	
	            } else if ( key ) {
	                // No value was defined, so set something meaningful.
	                obj[key] = coerce
	                ? undefined
	                : '';
	            }
	        });
	
	        return obj;
	    };
	    if ($) {
	      $.prototype.deparam = $.deparam = deparam;
	    }
	    return deparam;
	});


/***/ },

/***/ 114:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Order = exports.paymentStatuses = undefined;
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	exports.getOrder = getOrder;
	exports.startOrderFetching = startOrderFetching;
	
	var _jquery = __webpack_require__(5);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _envConfig = __webpack_require__(112);
	
	var _config = __webpack_require__(115);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	/**
	 * @param orderNumber
	 * @returns {Promise}
	 */
	function getOrder(checkoutToken) {
	  return _jquery2.default.getJSON(_envConfig.BACKEND_URL + '/order/' + checkoutToken).then(function (orders) {
	    if (typeof orders === "string") {
	      orders = JSON.parse(orders);
	    }
	    if (orders[0]) {
	      return new Order(orders[0]);
	    }
	    return _jquery2.default.Deferred().reject("No order has been found");
	  });
	}
	
	/**
	 * @param checkoutToken
	 * @returns {Promise}
	 */
	function startOrderFetching(checkoutToken) {
	  return new Promise(function (resolve, reject) {
	    var attemptCount = 0;
	    _getOrderAttempt();
	    function _getOrderAttempt() {
	      attemptCount++;
	      if (attemptCount > _config.maxAttemptNumber) {
	        return reject();
	      }
	      getOrder(checkoutToken).then(function (order) {
	        resolve(order);
	      }, function () {
	        setTimeout(function () {
	          return _getOrderAttempt();
	        }, _config.getOrderTimeoutBeforeNextAttempt);
	      });
	    }
	  });
	}
	
	var paymentStatuses = exports.paymentStatuses = {
	  CREATED: "CREATED",
	  COMPLETED: "COMPLETED",
	  REJECTED: "REJECTED",
	  CANCELED: "CANCELED",
	  PENDING: "PENDING",
	  WAITING_FOR_CONFIRMATION: "WAITING_FOR_CONFIRMATION"
	};
	
	var Order = exports.Order = function () {
	  function Order(data) {
	    _classCallCheck(this, Order);
	
	    this.checkout_token = null;
	    this.gateway = null;
	    Object.assign(this, data);
	  }
	
	  _createClass(Order, [{
	    key: 'isPayU',
	    get: function get() {
	      return this.gateway === _config.PAY_U_GATWAY;
	    }
	  }, {
	    key: 'status',
	    get: function get() {
	      return this.payU ? this.payU.status : undefined;
	    }
	  }]);

	  return Order;
	}();

/***/ },

/***/ 115:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var PAY_U_GATWAY = exports.PAY_U_GATWAY = "PayU";
	var maxAttemptNumber = exports.maxAttemptNumber = 5;
	var getOrderTimeoutBeforeNextAttempt = exports.getOrderTimeoutBeforeNextAttempt = 2500;

/***/ },

/***/ 116:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createServerError = createServerError;
	exports.createSomeError = createSomeError;
	exports.createCreatedMessage = createCreatedMessage;
	exports.createRejectedMessage = createRejectedMessage;
	exports.createCompletedMessage = createCompletedMessage;
	exports.createCanceledMessage = createCanceledMessage;
	exports.createWaitingForConfirmationMessage = createWaitingForConfirmationMessage;
	exports.createPendingMessage = createPendingMessage;
	/**
	 * When _expect_ to get info about order from _our_ servers but we can't for some reason
	 * @param refreshUrl
	 * @returns {string}
	 */
	function createServerError() {
	  return '\n    <h2 class="os-step__title error">Błąd serwera</h2>\n    <p class="error">Nie mogliśmy połączyć się z serwerem przez co nie wiemy jaki jest status płatności PayU.\n      Spróbuj za chwilę odświerzyć stronę. Możliwe, że to tylko chwilowe problemy. Jeśli problem nie ustępuje, \n      skontaktuj się z nami.\n    </p>\n    <p><a href="' + window.location.href + '">Spróbuj jeszcze raz</a></p>\n  ';
	}
	
	/**
	 * When any other error appears. Like error message from PayU, or wrong data about order status
	 * @returns {string}
	 */
	function createSomeError() {
	  var url = window.location.href.split('?')[0];
	
	  return '\n    <h2 class="os-step__title error">Błąd serwera</h2>\n    <p>W trakcie przetwarzania transakcji PayU wystąpił błąd.</p>\n    <p>Kliknij <a href="' + url + '">tutaj</a>, aby spróbować jeszcze raz.</p>\n    <p>Jeśli problem nie ustąpi, skontaktuj się z nami.</p>\n  ';
	}
	
	/**
	 * for order with CREATED status
	 * @param payUUrl
	 * @returns {string}
	 */
	function createCreatedMessage(payUUrl) {
	  return '\n    <p>Za chwilę zostaniesz przekierowany na strone PayU gdzię będziesz mógł dokonać płatności.</p>\n    <p>Jeśli tak się nie stanie, możesz się przenieść klikając <a id="navigate-to-payu" href="' + payUUrl + '">tutaj</a></p>    \n  ';
	}
	
	/**
	 * for order with REJECTED status
	 * @returns {string}
	 */
	function createRejectedMessage() {
	  return '\n    <h2 class="os-step__title error">Płatność została odrzucona</h2>\n    <p>Płatność została odrzucona, ale prawdopodobnie Twoje konto zostało obciążone. W razie wątpliwości prosimy o kontakt.</p>\n  ';
	}
	
	/**
	 * for order with COMPLETED status
	 * @returns {string}
	 */
	function createCompletedMessage() {
	  return '\n    <p>Płatność za zamowienie została zakceptowana. Dziękujemy.</p>\n  ';
	}
	
	/**
	 * for order with CANCELED status
	 * @returns {string}
	 */
	function createCanceledMessage() {
	  return '\n    <h2 class="os-step__title error">Płatność została anulowana</h2>\n    <p>Płatność została anulowana, Twoje konto nie zostało obciążone. W razie wątpliwości prosimy o kontakt.</p>\n  ';
	}
	
	/**
	 * for order with WAITING_FOR_CONFIRMATION status
	 * @returns {string}
	 */
	function createWaitingForConfirmationMessage() {
	  return '\n    <p>Płatność wymaga potwierdzenia. W razie wątpliwości prosimy o kontakt.</p>\n  ';
	}
	
	/**
	 * for order with WAITING_FOR_CONFIRMATION status
	 * @returns {string}
	 */
	function createPendingMessage() {
	  return '\n    <p>Płatność jest w trakcie rozliczenia.</p>\n  ';
	}

/***/ }

});
//# sourceMappingURL=thank-you.bundle.js.map