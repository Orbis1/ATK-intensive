define( ['./securityTools'], function ( securityTools ) {
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
        securityTools.removeExport();
      } catch (error) {
        console.log(error);
      }
			
			return qlik.Promise.resolve();

		}
	};
});

//'//code.highcharts.com/highcharts.js'
