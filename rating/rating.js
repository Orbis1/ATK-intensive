define(["qlik", "text!./rating.html", "css!./rating.css"], function (
  qlik,
  template
) {
  "use strict";
  return {
    template: template,
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 2,
            qHeight: 50,
          },
        ],
      },
    },

    definition: {
      type: "items",
      component: "accordion",
      items: {
        measures: {
          uses: "measures",
          min: 1,
          max: 1,
        },

        sorting: {
          uses: "sorting",
        },

        settings: {
          uses: "settings",
          items: {
            view: {
              label: "View",
              type: "items",
              items: {

                target: {
                  type: "string",
                  label: "Goal",
                  ref: "props.target",
                  expression: "optional",
                  defaultValue: "5",
                },

                heartMaxCount: {
                  type: "string",
                  label: "Max count",
                  ref: "props.heartMaxCount",
                  expression: "optional",
                  defaultValue: "5",
                },

                heartColor: {
                  type: "string",
                  label: "Color",
                  ref: "props.heartColor",
                  expression: "optional",
                  defaultValue: "red",
                },
              },
            },
          },
        },
      },
    },

    support: {
      snapshot: true,
      export: true,
      exportData: true,
    },

    paint: function ($element, layout) {
      try {
        let extension = $element[0];
        extension.innerHTML = "";

        let value = Number(layout.qHyperCube.qDataPages[0].qMatrix[0][0].qNum);
        let { target, heartMaxCount, heartColor } = layout.props;
        target = Number(target);
        heartMaxCount = Number(heartMaxCount);

        let heartCount = Math.floor(value / target * heartMaxCount);

        let svgContainer = document. createElement ('div');
        svgContainer.innerHTML = template;
        let filledHeart = svgContainer.querySelector('.rating-heart-filled')
        let borderHeart = svgContainer.querySelector('.rating-heart-border')
        
        let wrapper = document.createElement('div');
        wrapper.className = 'rating-wrapper';
        extension.appendChild(wrapper);

        let container = document.createElement('div');
        container.className = 'rating-container';
        wrapper.appendChild(container);
        let containerWidth = extension.offsetWidth;
        let containerHeigth = extension.offsetHeight;
        let heartSize = containerWidth / (heartMaxCount + 1);

        if (heartSize > containerHeigth) {
          heartSize = containerHeigth;
        };


  
        if (value <= 0 || isNaN(value)) heartCount = 0;
        if (value > target) heartCount = heartMaxCount;

        for (let i = 0; i < heartMaxCount; i++) {
          let heart;
          if (i <= heartCount) {
            heart = filledHeart.cloneNode(true);
          } else {
            heart = borderHeart.cloneNode(true);
          }
          heart.style.width = `${heartSize}px`;
          heart.style.heigth = `${heartSize}px`;
          heart.style.fill = heartColor;

          container.appendChild(heart);
        }

        console.log(extension);
      }
      catch (error) {
        console.log('!error', error);
      }
      return qlik.Promise.resolve();
    },
  };
});

// использовать только один svg файл