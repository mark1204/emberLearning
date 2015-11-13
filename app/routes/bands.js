import Ember from 'ember';
import Song from '../models/song';
import Band from '../models/band';

var blackDog = Song.create({
  title: 'Black Dog',
  rating: 3
});
var yellowLedbetter = Song.create({
  title: 'Yellow Ledbetter',
  rating: 4
});
var daughter = Song.create({
  title: 'Daughter',
  rating: 5
});
var pretender = Song.create({
  title: 'The Pretender',
  rating: 2
});



var BandsCollection = Ember.Object.extend({
	content: [],
	sortProperties: ['name:desc'],
	sortedContent: Ember.computed.sort('content', 'sortProperties'),
});
var ledZeppelin = Band.create({ name: 'Led Zeppelin',
                                songs: [blackDog] });
var pearlJam = Band.create({ name: 'Pearl Jam',
                              description: 'Pearl Jam is an American rock band, formed in Seattle, Washington in 1990.',
                              songs: [daughter, yellowLedbetter] });
var fooFighters = Band.create({ name: 'Foo Fighters', songs: [pretender] });

var bands = BandsCollection.create();
bands.get('content').pushObjects([ledZeppelin, pearlJam, fooFighters]);

blackDog.set('band', ledZeppelin);
yellowLedbetter.set('band', pearlJam);
daughter.set('band', pearlJam);
pretender.set('band', fooFighters);



export default Ember.Route.extend({
	model: function() {
		return bands;
	},

	afterModel: function(model){
	  var bands = model;

	  if(bands.lenght ===1 ){
	    this.transitionTo('bands.band', bands.get('firstObject'));
	  }

	},

  actions: {

    didTransition: function(){
      document.title = 'Bands - Rock & Roll';
    },

    createBand: function(){
      var name = this.get('controller').get('name');
      var band = Band.create({name:name});
      bands.get('content').pushObject(band);
      this.get('controller').set('name', '');
      this.transitionTo('bands.band.songs', band);
    }

  }
});
