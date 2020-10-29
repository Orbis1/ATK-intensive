define(function () {
  return {
    removeExport: function () {
      const removeExportNode = (contextMenu) => {
        if (!contextMenu) return;

        const isExportDataItem = (node) => {
          let items = [];
          // проверяем сам пункт меню
          if (
            node.hasAttribute("tid") &&
            ["i9fd7", "insight-chart-expand-button"].includes(
              node.getAttribute("tid").toLowerCase()
            )
          ) {
            items.push(node);
          } else {
            // проверяем содержимое пунка меню
            node.childNodes.forEach((item) => {
              if (
                item instanceof HTMLElement &&
                item.hasAttribute("tid") &&
                [
                  "export-group",
                  "export",
                  "cao-share",
                  "79f6",
                  "sharegroup",
                ].includes(item.getAttribute("tid").toLowerCase())
              ) {
                items.push(item.parentElement);
              }
            });
          }
          console.log("isExportDataItem -> items", items);
          return items.length > 0;
        };

        let itemsInMenu = 0;
        let exportDataNode = [];

        // перебираем все элементы меню
        contextMenu.querySelectorAll("li, button").forEach((item) => {
          if (isExportDataItem(item)) exportDataNode.push(item);
          itemsInMenu++;
        });

        if (exportDataNode.length === 0) return;

        // если в списке только один элемент, то удалить весь список, иначе только строку экспорта
        if (itemsInMenu > exportDataNode.length) {
          exportDataNode.forEach(item => item.style = "background-color: red");
          // exportDataNode.remove();
        } else {
          contextMenu.style = "background-color: red";
          // contextMenu.remove();
        }
      };

      // выбираем элемент
      let target = document.body;
      let popover = null;

      // создаем экземпляр наблюдателя, которые отлавливает появление контекстного меню
      // filter of body`s mutations
      let searchContextMenu = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // console.log(mutation.target);
          // console.log(mutation);
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement && node.hasAttribute("tid")) {
                popover = mutation.target;
                watchContextMenu.observe(mutation.target, config);
                removeExportNode(popover);
              }
              // для vizlib
              if (
                node instanceof HTMLElement &&
                node.className.match("vzl-*")
              ) {
                node.querySelectorAll(".fa-file-excel-o").forEach((item) => {
                  if (item.parentNode) item.parentNode.remove();
                });
              }
            });
          }
        });
      });

      // создаем экземпляр наблюдателя для изменений в контекстном меню
      let watchContextMenu = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // поиск добавления пунка в меню
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (
                node instanceof HTMLElement &&
                node.tagName === "LI" &&
                node.querySelectorAll("span")[0].hasAttribute("tid")
              ) {
                removeExportNode(popover);
              }
            });
          }
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
      searchContextMenu.observe(target, config);

      // позже можно остановить наблюдение
      // observer.disconnect();
    },

    sayHi: function () {
      alert("Всем привет!");
    },
  };
});
