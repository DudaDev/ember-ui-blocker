import Ember from 'ember';
import layout from '../templates/components/block-ui';

export default Ember.Component.extend(Ember.$.extend({
	layout: layout
	startBlocking: function() {
		this.get('uiBlocker').block();
	}.on('didInsertElement'),
	stopBlocking: function() {
		this.get('uiBlocker').unblock();
	}.on('willDestroyElement')
}, (Ember.inject && Ember.inject.service) ? {uiBlocker: Ember.inject.service()} : {});