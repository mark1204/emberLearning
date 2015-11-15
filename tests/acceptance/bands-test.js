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
      if(server)
        server.shutdown();
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

      //return data format has problem. have not found resource online.
      //httpStubs.stubBands(this, [{id: 1, attributes:{name: "Radiohead"}}])

      this.get('/bands', function(){
        var response = {
          data:[
            {id:1, type:"bands", attributes:{name: "Radiohead"}}
          ]

        };

        return [200, {"Content-Type": "application/vnd.api+json"},JSON.stringify(response)];
      });

      this.post('/bands', function(){

        var response = {
            data:[
               {id:2, type:"bands", attributes:{name: "Long Distance Calling"}},
            ]

        };

        return [200, {"Content-Type": "application/vnd.api+json"},JSON.stringify(response)];

      });

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
