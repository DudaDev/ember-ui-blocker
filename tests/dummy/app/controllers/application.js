import Ember from 'ember';

var Promise = Ember.RSVP.Promise;
export default Ember.Controller.extend({
	uiBlocker: Ember.inject.service(),
	step: 0,
	actions: {
		doSomethingAsyncAndBlock: function() {
			this.set('step', 0);
			this.get('uiBlocker').executeWhileBlocking([
				this.completeStep1.bind(this),
				this.completeStep2.bind(this),
				this.completeStep3.bind(this)
			]);
		},
		failAsyncAndBlock: function() {
			this.set('step', 0);
			this.get('uiBlocker').executeWhileBlocking([
				this.completeStep1.bind(this),
				this.completeStep2.bind(this),
				this.fail.bind(this)
			],[
				function(payload){
					window.alert('error message: ' + payload.message);
				}
			]);
		}
	},
	completeStep1: function() {
		return new Promise(function(resolve, reject) {
			Ember.run.later(this, function() {
				this.set('step', 1);
				resolve();
			}, 500);
		}.bind(this));
	},
	completeStep2: function() {
		return new Promise(function(resolve, reject) {
			Ember.run.later(this, function() {
				this.set('step', 2);
				resolve();
			}, 500);
		}.bind(this));
	},
	completeStep3: function() {
		return new Promise(function(resolve, reject) {
			Ember.run.later(this, function() {
				this.set('step', 3);
				resolve();
			}, 500);
		}.bind(this));
	},
	fail: function(){
		return new Promise(function(resolve,reject){
			Ember.run.later(this, function() {
				reject(new Error('failed'));
			}, 500);
			
		});
	}
});