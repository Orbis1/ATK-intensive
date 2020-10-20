define( ["qlik", "jquery"], function ( qlik, $ ) {
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
		paint: function ( $element,layout ) {
      alert('security.js is running v.4');

      try {
        // $("select[title='export]")

        // выбираем элемент
        let target = document.querySelector('.ng-scope');
        
        // создаем экземпляр наблюдателя
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                console.log(mutation.type);
            });    
        });
        
        // настраиваем наблюдатель
        var config = { attributes: true, subtree: true, childList: true, characterData: true }
        
        // передаем элемент и настройки в наблюдатель
        observer.observe(target, config);
        
        // позже можно остановить наблюдение
        // observer.disconnect();        
        
      } catch (error) {
        console.log(error);
      }
			
			return qlik.Promise.resolve();

		}
	};
} );

