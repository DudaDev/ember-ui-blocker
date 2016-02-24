import Ember from 'ember';
import defaultOptions from '../defaults/options';

var $ = Ember.$;
var hasSpinjs = typeof $.fn.spin === 'function' && typeof window.Spinner === 'function';

export default (Ember.Service || Ember.Object).extend({
	options: defaultOptions,
	block: function(options) {
		options = $.extend(true, {}, this.get('options'), options || {});
		$.blockUI(options.blockUIOptions);
		if (!options.disableSpinner) {
			this.startSpin(options);
		}
	},
	setDefaultOptions: function(newDefaultOptions) {
		newDefaultOptions = newDefaultOptions || {};
		var options = this.get('options');
		this.set('options', $.extend(true, {}, options, newDefaultOptions));
	},
	unblock: function(options) {
		options = $.extend(true, {}, this.get('options'), options || {});
		$.unblockUI();
		this.stopSpin(options);
	},
	startSpin: function(options) {
		if (hasSpinjs) {
			$(options.spinnerSelector).spin(options.spinjsOptions);	
		}
	},
	stopSpin: function(options) {
		if (hasSpinjs) {
			$(options.spinnerSelector).spin(false);
		}
	},
	isBlocking: false,
	positivePromisesNamesToAppend: [],
	toggleBlocking: function(options, data) {
		options = $.extend(true, {}, this.get('options'), options || {});
		var promise = new Ember.RSVP.Promise(function(resolve) {
			this.toggleProperty('isBlocking');
			if (this.get('isBlocking')) {
				this.block(options);
			} else {
				this.unblock(options);
			}
			Ember.run.later(this, function() {
				resolve(data);
			}, options.blockDelay);
		}.bind(this));
		return promise;
	},
	executeWhileBlocking: function(positiveFuncs, negativeFuncs, options) {
		var promise = this.toggleBlocking(options),
			negativeDeferred = Ember.RSVP.defer(),
			negativePromise = negativeDeferred.promise,
			positivePromisesToAppend = this.get('positivePromisesNamesToAppend').map(function(promiseName) {
				return Ember.get(this, promiseName).bind(this);
			}, this);
		positiveFuncs = positiveFuncs || [];
		negativeFuncs = negativeFuncs || [];
		positiveFuncs.forEach(function(func) {
			promise = promise.then(func);
		});
		negativeFuncs.forEach(function(func) {
			negativePromise = negativePromise.then(func);
		});
		negativePromise['finally'](this.toggleBlocking.bind(this, options));

		positivePromisesToAppend.forEach(function(positivePromiseToAppend) {
			promise = promise.then(positivePromiseToAppend);
		});
		promise = promise.then(this.toggleBlocking.bind(this, options));
		promise['catch'](function(error) {
			negativeDeferred.resolve(error);
		});

		return promise;
	},
	promiseWhileBlocking: function(positiveFuncs, negativeFuncs) {
		return function() {
			return this.executeWithinBlocking(positiveFuncs, negativeFuncs);
		}.bind(this);
	},
	blockUntilElementIsInDOM: function(options, blockOptions) {
		return this.blockUntilConditionIsSatisfied($.extend({
			conditionFn: this._elementIsInDOMConditionFn.bind(this)
		}, options), blockOptions);
	},
	blockUntilConditionIsSatisfied: function(options, blockOptions) {
		var intervalSubscriber,
			deferred = Ember.RSVP.defer(),
			timeCounter = 0;
		options = options || {};
		options.interval = options.interval || 500;
		options.timeout = options.timeout || 30000;
		options.conditionFn = options.conditionFn || function() {
			return true;
		};
		this.block(blockOptions);
		intervalSubscriber = window.setInterval(Ember.run.bind(this, function() {
			timeCounter += options.interval;
			if (options.conditionFn(options)) {
				this.unblock();
				window.clearInterval(intervalSubscriber);
				deferred.resolve();
			} else if (timeCounter > options.timeout) {
				deferred.reject();
			}
		}), options.interval);
		return deferred.promise;
	},
	_elementIsInDOMConditionFn: function(options) {
		return $(options.selector).length > 0;
	}
});