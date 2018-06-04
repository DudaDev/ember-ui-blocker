/* jshint node: true */
'use strict';

module.exports = {
	name: 'ember-ui-blocker',
	included: function lightbox_included(app) {
		var addonConfig = this.app.project.config(app.env)['ember-ui-blocker'] || {};
		
		this.app.import('bower_components/blockui/jquery.blockUI.js');

		if (addonConfig.includeSpinjs) {
			this.app.import('bower_components/spin.js/spin.js');
			this.app.import('bower_components/spin.js/jquery.spin.js');		
		}
	}
};
