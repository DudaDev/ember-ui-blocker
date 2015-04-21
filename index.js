/* jshint node: true */
'use strict';

module.exports = {
	name: 'ember-ui-blocker',
	included: function lightbox_included(app) {
		this.app.import('bower_components/blockUI/jquery.blockUI.js');
		this.app.import('bower_components/spin.js/spin.js');
		this.app.import('bower_components/spin.js/jquery.spin.js');
	}
};