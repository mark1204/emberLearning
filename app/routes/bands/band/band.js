export default Ember.Route.extend({
	model: function() {
		
		var bands = this.modelFor('bands');

		return bands.get('content').findBy('slug', params.slug);
	}
});
