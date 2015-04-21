import uiBlocker from 'ember-ui-blocker/services/ui-blocker';
import config from '../config/environment';
import Ember from 'ember';
export default uiBlocker.extend({
	init: function(){
		this._super();
		var configBlockOptions = Ember.get(config, 'ember-ui-blocker') || {};
		var options = this.get('options');
		options = $.extend(true, {}, options, configBlockOptions);
		this.set('options', options);
	}
});
