define(function () {
  return {
    removeExport: function () {

      // выбираем элемент
      let target = document.body;

      //#region Дополнительные функции

      // возвращает элемент DOM соответствующий контекстному меню
      const getPopover = (node) => {
        const popoverIn = node.querySelector('.lui-popover');
        const popoverOut = node.closest('.lui-popover');
        return popoverIn || popoverOut;
      };

      // перебор всех дочерних элементо в node
      const inspectChildNodes = (node) => {
        let result = false;
        if(node.childElementCount === 0) return;
        node.childNodes.forEach(child => {
          if(!(child instanceof HTMLElement)) return; // если child текст
          if(result) return; // если предыдущий child isExportNode = true
          if(isExportNode(child)) {
            result = true
          } else {
            result = inspectChildNodes(child);
          };
        });
        return result;
      };

      // возвращает множество элементов содержащиз экспорт
      const getExportItems = (contextMenu) => {
        let exportItems = new Set();
        contextMenu.querySelectorAll('li').forEach(item => {
          if(isExportNode(item)) exportItems.add(item);
          if(inspectChildNodes(item)) exportItems.add(item);
        });
        return exportItems;
      };

      // определяет содержит ли в себе нода признаки экпорта
      const isExportNode = (node) => {

        // проверка по tid
        if(node.hasAttribute("tid")) {
          const tid = node.getAttribute("tid").toLowerCase();
          return ["i9fd7", 'insight-chart-export-button',"export-group", "export", "cao-share", "79f6", "sharegroup"].includes(tid);
        };

        return false;
      };

      // Удаление элементов из DOM
      const removeDOM = (setItems) => {
        for (let value of setItems) {
          value.style = 'background-color: red';
          value.remove();
        };
      }
      //#endregion

      // создаем экземпляр наблюдателя, который отлавливает изменения в DOM
      let searchDOMChanges = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // console.log('mutation', mutation);
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            const popover = getPopover(node);
            if(popover) {
              const exportItems = getExportItems(popover);
              if(exportItems.size>0) removeDOM(exportItems);
            }
          });
        });
      });

      // настраиваем наблюдатель
      var config = {
        attributes: false,
        subtree: true,
        childList: true,
        characterData: true,
      };

      // передаем элемент и настройки в наблюдатель
      searchDOMChanges.observe(target, config);

      // позже можно остановить наблюдение
      // observer.disconnect();
    },

    sayHi: function () {
      alert("Всем привет!");
    },
  };
});
