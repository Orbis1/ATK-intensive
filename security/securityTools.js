define(function () {
  return {

    removeExport: function () {
    
      const removeExportNode = (contextMenu) => {

        if(!contextMenu) return;

        const isExportDataItem = (node) => {
          let items = [];
          node.childNodes.forEach(item => {
            if(item instanceof HTMLElement && item.getAttribute('tid') === 'export-group') {
              items.push(item.parentElement);
            };
          });
          return items.length > 0;
        }

        let itemsInMenu = 0;
        let exportDataNode = null;
        
        // перебираем все элементы меню
        contextMenu.querySelectorAll('li').forEach(item => {
          if(isExportDataItem(item)) exportDataNode = item;
          itemsInMenu++;
        });        

        if(exportDataNode === null) return;

        // если в списке только один элемент, то удалить весь список, иначе только строку экспорта
        if(itemsInMenu > 1) {
          console.log('removing node', exportDataNode);
          // exportDataNode.remove();
        } else {
          console.log('removing contextMenu', contextMenu);
          // contextMenu.remove();
        }
      };

      // выбираем элемент
      let target = document.body;
      let popover = null;

      // создаем экземпляр наблюдателя, которые отлавливает появление контекстного меню
      let searchContextMenu = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if(mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node instanceof HTMLElement && node.getAttribute('tid') === 'context-menu') {
                popover = mutation.target;
                watchContextMenu.observe(mutation.target, config)
                removeExportNode(popover);
              };
            });
          }
        });    
      });

      // создаем экземпляр наблюдателя для изменений в контекстном меню
      let watchContextMenu = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          // поиск добавления пунка в меню
          if(mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (
                node instanceof HTMLElement 
                && node.tagName === 'LI' 
                && node.querySelectorAll('span')[0].getAttribute('tid') === 'export-group'
                ) {
                  removeExportNode(popover);
              };
            });
          }
        });    
      });

      // настраиваем наблюдатель
      var config = { attributes: false, subtree: true, childList: true, characterData: true }

      // передаем элемент и настройки в наблюдатель
      searchContextMenu.observe(target, config);

      // позже можно остановить наблюдение
      // observer.disconnect();  
    },

    sayHi: function () {
      alert( 'Всем привет!' );;
    }

  };
});      
