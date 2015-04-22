module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function(options) {
    this.addBowerPackageToProject('spin.js', '2.1.0').then(function(){
    	return this.addBowerPackageToProject('blockUI');
    }.bind(this));
    
  }
};