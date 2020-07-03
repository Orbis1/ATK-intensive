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

                iconMaxCount: {
                  type: "string",
                  label: "Max count",
                  ref: "props.iconMaxCount",
                  expression: "optional",
                  defaultValue: "5",
                },

                iconColor: {
                  label: "Color",
                  component: "color-picker",
                  ref: "props.iconColor",
                  type: "object",
                  defaultValue: {
                    color: "#b0afae",
                    index: 1
                  },
                },

                iconType: {
                  type: "string",
                  component: "dropdown",
                  label: "Icon type",
                  ref: "props.iconType",
                  options: [{
                    value: "main",
                    label: "main"
                  }, {
                    value: "minor",
                    label: "minor"
                  }],
                  defaultValue: "main"
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
        let { target, iconMaxCount} = layout.props;
        target = Number(target);
        iconMaxCount = Number(iconMaxCount);
        let iconColor = layout.props.iconColor.color;

        let iconCount = Math.floor(value / target * iconMaxCount);

        let svgContainer = document. createElement ('div');
        svgContainer.innerHTML = template;
        let filledicon = svgContainer.querySelector('.rating-icon-filled')
        let bordericon = svgContainer.querySelector('.rating-icon-border')
        
        let wrapper = document.createElement('div');
        wrapper.className = 'rating-wrapper';
        extension.appendChild(wrapper);

        let container = document.createElement('div');
        container.className = 'rating-container';
        wrapper.appendChild(container);
        let containerWidth = extension.offsetWidth;
        let containerHeigth = extension.offsetHeight;
        let iconSize = containerWidth / (iconMaxCount + 1);

        if (iconSize > containerHeigth) {
          iconSize = containerHeigth;
        };


  
        if (value <= 0 || isNaN(value)) iconCount = 0;
        if (value > target) iconCount = iconMaxCount;

        for (let i = 0; i < iconMaxCount; i++) {
          let icon;
          if (i <= iconCount) {
            icon = filledicon.cloneNode(true);
          } else {
            icon = bordericon.cloneNode(true);
          }
          icon.style.width = `${iconSize}px`;
          icon.style.heigth = `${iconSize}px`;
          icon.style.fill = iconColor;

          container.appendChild(icon);
        }

        
      }
      catch (error) {
        console.log('!error', error);
      }
      console.log(layout);
      return qlik.Promise.resolve();
    },
  };
});

// использовать только один svg файл