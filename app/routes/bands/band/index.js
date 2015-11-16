import Ember from 'ember';
import Band from '../../../models/band';

export default Ember.Route.extend({


 afterModel: function(band){

    if(band instanceof Band){

    }else{
      var bands = this.modelFor('bands');

    	console.log("Model hook called for 'bands.band' called with ", band.slug);

    	band = bands.get('content').findBy('slug', band.slug);

    }


	  var description = band.get('description');

	  if(Ember.isEmpty(description)){
	    this.transitionTo('bands.band.songs');
	  }else{
	    this.transitionTo('bands.band.details');
	  }

	}

});
