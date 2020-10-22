define(function () {
  return {

    removeExport: function () {
    
      const removeExportNode = (popupMenu) => {
        // перебираем все элементы меню
        popupMenu.querySelectorAll('.lui-list__text').forEach(item => {
          if (item.getAttribute('tid') === 'export-group') {
            let exportDataNode = item.closest('.lui-list__item');
            let itemsInList = exportDataNode.parentNode.children.length;
            
            // если в списке только один элемент, то удалить весь список, иначе только строку экспорта
            if(itemsInList > 1) {
              console.log('removing node', exportDataNode);
              exportDataNode.remove();
            } else {
              console.log('removing popupMenu', popupMenu);
              popupMenu.remove();
            }
          }
        });
      };

      // выбираем элемент
      let target = document.body;

      // создаем экземпляр наблюдателя
      let observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
          console.log("mutation", mutation);
            
            // находим в изменения всплывающее контектсное меню
            if(mutation.target.className === "lui-popover") {
              console.log("mutation.target", mutation.target);
              
              // removeExportNode(mutation.target);
            }
          });    
      });

      // настраиваем наблюдатель
      var config = { attributes: false, subtree: true, childList: true, characterData: true }

      // передаем элемент и настройки в наблюдатель
      observer.observe(target, config);

      // позже можно остановить наблюдение
      // observer.disconnect();  
    },

    sayHi: function () {
      alert( 'Всем привет!' );;
    }

  };
});      
