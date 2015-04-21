import config from '../config/environment';

export function initialize(container, application) {
	if (!(Ember.Service && Ember.inject && Ember.inject.service)){
		application.inject('route', 'uiBlocker', 'service:ui-blocker');
		application.inject('controller', 'uiBlocker', 'service:ui-blocker');
		application.inject('view', 'uiBlocker', 'service:ui-blocker');
		application.inject('component', 'uiBlocker', 'service:ui-blocker');	
	}
}

export default {
  name: 'ui-blocker-service',
  initialize: initialize
};