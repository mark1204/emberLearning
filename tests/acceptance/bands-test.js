import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'my-new-app/tests/helpers/start-app';
import Pretender from 'pretender';
import httpStubs from 'my-new-app/tests/helpers/http-stubs';

  var server;

  module('Acceptance | bands', {
    beforeEach: function() {
      this.application = startApp();
    },

    afterEach: function() {
      Ember.run(this.application, 'destroy');

      /* jshint ignore:start */
      if(server)
        server.shutdown();
      /* jshint ignore:end */
    }
  });

  test('visiting /bands', function(assert) {
    visit('/bands');

    andThen(function() {
      assert.equal(currentURL(), '/bands');
    });
  });

  test('List bands', function(assert){

    server = new Pretender(function(){
      this.get('/bands', function(){

        var response = {
          data:[
            {id:1, type:"bands", attributes:{name: "Radiohead"}},
            {id:2, type:"bands", attributes:{name: "Long Distance Calling"}},
          ]

        };

        return [200, {"Content-Type": "application/vnd.api+json"},JSON.stringify(response)];
      });
    });



    visit('/bands');

    andThen(function(){
      assertLength(assert, '.band-link', 2, "All bands are rendered.");

      assertLength(assert, '.band-link:contains("Radiohead")', 1, "Found 1 band with name - Radiohead");

    });

  });


  test('Creating a band', function(assert){

    server = new Pretender(function(){

      httpStubs.stubBands(this, [{id: 1, attributes:{name: "Radiohead"}}]);

      httpStubs.stubCreateBand(this, 2);

    });

    visit('/bands');
    fillIn('.new-band', 'Long Distance Calling');
    click('.new-band-button');

    andThen(function(){
      assertLength(assert, '.band-link', 2, "All bands are rendered.");

      assertTrimmedText(assert, '.band-link:last', 'Long Distance Calling', "Created 1 band successfully");

      assertLength(assert, '.nav a.active:contains("Songs")', 1, "The Songs tab is active");
    });

  });


  test('Create a song in two steps', function(assert){

    server = new Pretender(function(){

        this.get('/bands', function(){
          var response = {
            data:[
              {id:1, type:"bands", attributes:{name: "Radiohead"}}
            ]

          };

          return [200, {"Content-Type": "application/vnd.api+json"},JSON.stringify(response)];
        });

        this.post('/songs', function(){

          var response = {
              data:[
                 {id:1, type:"songs", attributes:{name: "Killer Cars"}},
              ]

          };

          return [200, {"Content-Type": "application/vnd.api+json"},JSON.stringify(response)];

        });

    });

    selectBand('Radiohead');
    click('a:contains("create one")');
    fillIn('.new-song', 'Killer Cars');
    triggerEvent('.new-song-form', 'submit');

    andThen(function() {
      assertElement(assert, '.songs .song:contains("Killer Cars")', "Creates the song and displays it in the list");
    });
  });

test('Sort songs in various ways', function(assert){
  server = new Pretender(function(){

  httpStubs.stubBands(this, [{id:1, attributes:{name: "Them Crooked Vultures"}}]);

  httpStubs.studSongs(this, 1, [{id: 1, attributes: {title: "Elephants", rating: 5}},
                                  {id: 2, attributes: {title: "New Fang", rating: 4}},
                                  {id: 3, attributes: {title: "Mind Eraser, No Chaser",rating: 4}},
                                  {id: 4, attributes: {title: "Spinning in Daffodils", rating: 5}}
                                ]
                      );
  });

  selectBand('Them Crooked Vultures');

  andThen(function(){

    assert.equal(currentURL(), '/bands/1/songs');
    assertTrimmedText(assert, '.song:first', 'Elephants', "The first song is the highest ranked, first in the alphabet");
    assertTrimmedText(assert, '.song:last', 'New Fang', "The last song is the lowest ranked, last in the alphabet");
  });

  click('button.sort-title-desc');

  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs?sort=titleDesc');
    assertTrimmedText(assert, '.song:first', 'Spinning in Daffodils', "The first song is the one that is the last in the alphabet");
    assertTrimmedText(assert, '.song:last', 'Elephants', "The last song is the one that is the first in the alphabet");
  });

  click('button.sort-rating-asc');

  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs?sort=ratingAsc');
    assertTrimmedText(assert, '.song:first', 'Mind Eraser, No Chaser', "The first song is the lowest ranked, first in the alphabet");
    assertTrimmedText(assert, '.song:last', 'Spinning in Daffodils', "The last song is the highest ranked, last in the alphabet");
  });

});


test('Search songs', function(assert){
    server = new Pretender(function(){

    httpStubs.stubBands(this, [{id:1, attributes:{name: "Them Crooked Vultures"}}]);

    httpStubs.studSongs(this, 1, [{id: 1, attributes: {title: "Elephants", rating: 5}},
          {id: 2, attributes: {title: "New Fang", rating: 4}},
          {id: 3, attributes: {title: "Mind Eraser, No Chaser",rating: 4}},
          {id: 4, attributes: {title: "Spinning in Daffodils", rating: 5}},
          {id: 5, type:'songs', attributes: {title: "No One Loves Me & Neither Do I", rating: 5}}
        ]
      );
    });

    selectBand('Them Crooked Vultures');

    fillIn('.search-field', 'no');

    andThen(() => {
      assertLength(assert, '.song', 2, "The songs matching the search term are displayed");
    });

    click('button.sort-title-desc');

    andThen(() => {
      assertTrimmedText(assert, '.song:first', 'No One Loves Me & Neither Do I', "A matching song that comes later in the alphahet appears on top");
      assertTrimmedText(assert, '.song:last', 'Mind Eraser, No Chaser', "A matching song that comes sooner in the alphahet appears at the bottom ");
    });


});
