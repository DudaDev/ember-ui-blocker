# Ember-ui-blocker

Ember addon for UI blocking combined with a spinner.  
Implemented with [block-ui](http://jquery.malsup.com/block/) & [spin.js](http://spin.js.org/)



## Installation

* `npm install ember-ui-blocker --save-dev`
* `ember g ember-ui-blocker`

## Usage
```javascript
// app/some-route/route.js
export default Ember.Route.extend({
	uiBlocker: Ember.inject.service(),
	actions: {
		doSomethingAsyncAndBlock: function(){
			this.get('uiBlocker').executeWhileBlocking([
				//Positive promises. Will be executed sequently
				promise1,
				promise2,
				promise3
			],[
				//Negative promises. Will be executed sequently on a fail
				promise4,
				promise5,
				promise6
			]).then(function(){
				//Do something... or not
			});
		},
		block: function(){
			this.get('uiBlocker').block();
		},
		unblock: function(){
			this.get('uiBlocker').unblock();
		}
	}
});
```

## Configuration
* You can deep-merge custom options with the [default options](https://github.com/DudaDev/ember-ui-blocker/blob/master/addon/defaults/options.js) by adding the following to `config/environment.js`
```javascript
	'ember-ui-blocker': {
		/* The default options are:
			disableSpinner: false,
			spinnerSelector: 'body',
			blockDelay: 200, // minimum blocking delay for the method 'executeWhileBlocking'
			blockUIOptions: { ... }, //See options for http://jquery.malsup.com/block/
			spinjsOptions:  { .. } //See options for http://spin.js.org/
		*/
    }
```
* In addition, you can always pass options to every method as a last argument.  
These options will be deep-merged with the [default options](https://github.com/DudaDev/ember-ui-blocker/blob/master/addon/defaults/options.js) & the above custom options.
```javascript
// app/some-route/route.js
export default Ember.Route.extend({
	uiBlocker: Ember.inject.service(),
	actions: {
		doSomethingAsyncAndBlock: function(){
			this.get('uiBlocker').executeWhileBlocking([
				//...
			],[
				//..
			],{
				/* your custom options*/
			})
		},
		block: function(){
			this.get('uiBlocker').block({/* your custom options*/});
		},
		unblock: function(){
			this.get('uiBlocker').unblock({/* your custom options*/});
		}
	}
});
```
## License
MIT
