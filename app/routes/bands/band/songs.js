import Ember from 'ember';
//import wait from '../../../utils/wait';
import {capitalize as capitalizeWords} from '../../../helpers/capitalize';

export default Ember.Route.extend({

  model: function(){
    //return wait(this.modelFor('bands.band'), 3000);
    return this.modelFor('bands.band');
  },

  actions: {

    didTransition: function(){
      var band = this.modelFor('bands.band');
      var name = capitalizeWords(band.get('name'));
      document.title = `${name} songs - Rock & Roll`;

    },

    createSong: function(){
      var controller = this.get('controller'),
          band = this.modelFor('bands.band');

      var song = this.store.createRecord('song', {title: controller.get('title'), band:band});

      song.save().then(function(){
         controller.set('title', '');
      });
    },

    updateRating: function(params){
      var song = params.item,
          rating = params.rating;

      if (song.get('rating') === rating) {
          rating = 0;
      }

      song.set('rating',rating);

      song.save();
    },

    /*loading: function() {
      window.alert("Loading the band's songs, ok?");
    }*/
  }

});
