define( ["qlik", "jquery", './helloWorld'], function ( qlik, helloWorld ) {
	'use strict';
	return {
		initialProperties: {
		},
		definition: {
      type: "items",
        component: "accordion",
        items: {
          sorting: {
            uses: "sorting"
          }
        }
		},
		support : {
		},
		paint: function () {
      try {
        helloWorld.showMessage();
      } catch (error) {
        console.log(error);
      }
			
			return qlik.Promise.resolve();

		}
	};
});

//'//code.highcharts.com/highcharts.js'
