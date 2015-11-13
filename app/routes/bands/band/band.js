import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {

		var bands = this.modelFor('bands');

		console.log("Model hook called for 'bands.band' called with ", params.slug);

		return bands.get('content').findBy('slug', params.slug);
	}



});
