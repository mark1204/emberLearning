import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {

		//var bands = this.modelFor('bands');
    console.log('sdfdsfdsf');
		console.debug("Model hook called for 'bands.band' called with " + params.id);

		return this.store.findRecord('band', params.id);
	}



});
