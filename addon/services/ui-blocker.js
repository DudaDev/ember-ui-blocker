import Ember from 'ember';
import defaultOptions from '../defaults/options';

var $ = Ember.$;
export default (Ember.Service || Ember.Object).extend({
	options: defaultOptions,
	block: function(options){
		options = $.extend(true, {}, this.get('options'), options || {});
		$.blockUI(options.blockUIOptions);
		if (!options.disableSpinner){
			$(options.spinnerSelector).spin(options.spinjsOptions);
		}
	},
	unblock: function(options){
		options = $.extend(true, {}, this.get('options'), options || {});
		$.unblockUI();
		$(options.spinnerSelector).spin(false);
	},
	isBlocking: false,
	positivePromisesNamesToAppend: [],
	toggleBlocking: function(options, data) {
		options = $.extend(true, {}, this.get('options'), options || {});
		var promise = new Ember.RSVP.Promise(function(resolve) {
			this.toggleProperty('isBlocking');
			if (this.get('isBlocking')){
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
		var promise = this.toggleBlocking(),
			negativeDeferred = Ember.RSVP.defer(),
			negativePromise = negativeDeferred.promise,
			positivePromisesToAppend = this.get('positivePromisesNamesToAppend').map(function(promiseName){
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

		positivePromisesToAppend.forEach(function(positivePromiseToAppend){
			promise = promise.then(positivePromiseToAppend);
		});
		promise = promise.then(this.toggleBlocking.bind(this, options));
		promise['catch'](function(error){
			negativeDeferred.resolve(error);
		});

		return promise;
	},
	promiseWhileBlocking: function(positiveFuncs, negativeFuncs) {
		return function() {
			return this.executeWithinBlocking(positiveFuncs, negativeFuncs);
		}.bind(this);
	}
});
