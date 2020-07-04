define( [ "qlik", "css!./buttons.css"
],
function (qlik) {

    return {
      initialProperties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qInitialDataFetch: [{
              qWidth: 2,
              qHeight: 50,
          },],
        },
      },
      
      definition: {
        type: "items",
        component: "accordion",
        items: {
          dimensions: {
            uses: "dimensions",
            min: 1,
            max: 1,
          },

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
              positionType: {
                label: "Позиционирование кнопок",
                type: "string",
                component: "dropdown",
                ref: "props.button.positionType",
                options: [{
                  value: "flex-start",
                  label: "слева"
                }, {
                  value: "center",
                  label: "центр"
                }, {
                  value: "flex-end",
                  label: "справа"
                }],
                defaultValue: "flex-start"

              },
              inactive: {
                label: "Неактивные кнопки",
                type: "items",
                items: {
                  backrgoundColor: {
                    type: "object",
                    component: "color-picker",
                    ref: "props.button.inactive.backrgoundColor",
                    defaultValue: {
                      color: '#b0afae',
                      index: 1
                    },
                    label: "Цвет фона"
                  },                  
                  fontColor: {
                    type: "object",
                    component: "color-picker",
                    ref: "props.button.inactive.fontColor",
                    defaultValue: {
                      color: '#545352',
                      index: 3
                    },
                    label: "Цвет шрифта"
                  },
                  borderColor: {
                    type: "object",
                    component: "color-picker",
                    ref: "props.button.inactive.borderColor",
                    defaultValue: {
                      color: '#b0afae',
                      index: 1
                    },
                    label: "Цвет границы"
                  },
                  borderRound: {
                    type: "integer",
                    component: "slider",
                    ref: "props.button.inactive.borderRound",
                    defaultValue: 10,
                    min: 0,
                    max: 10,
                    step: 1,
                    label: "Округлённость границы"
                  }
                }
              },

              active: {
                label: "Активные кнопки",
                type: "items",
                items: {
                  backrgoundColor: {
                    type: "object",
                    component: "color-picker",
                    ref: "props.button.active.backrgoundColor",
                    defaultValue: {
                      color: '#4477aa',
                      index: 4
                    },
                    label: "Цвет фона"
                  },                  
                  fontColor: {
                    type: "object",
                    component: "color-picker",
                    ref: "props.button.active.fontColor",
                    defaultValue: {
                      color: '#fff',
                      index: 11
                    },
                    label: "Цвет шрифта"
                  },
                  borderColor: {
                    type: "object",
                    component: "color-picker",
                    ref: "props.button.active.borderColor",
                    defaultValue: {
                      color: '#4477aa',
                      index: 4
                    },
                    label: "Цвет границы"
                  },
                  borderRound: {
                    type: "integer",
                    component: "slider",
                    ref: "props.button.active.borderRound",
                    defaultValue: 10,
                    min: 0,
                    max: 10,
                    step: 1,
                    label: "Округлённость границы"
                  }
                }
              }

            }
          },
        },
      },

      support : {
          snapshot: true,
          export: true,
          exportData : false
      },

      paint: function ($element, layout) {
        try {
          let self = this;
          let extension = $element[0];
          extension.innerHTML = "";
          let hypercube = layout.qHyperCube;
          const data = hypercube.qDataPages[0].qMatrix;
          let container = document.createElement('div');
          extension.appendChild(container);

          const drawBtn = (item) => {
            let button = document.createElement('button');
            button.innerHTML = item[0].qText;
            button.setAttribute('data-value', item[0].qElemNumber);
            button.className = 'buttons-btn';
            

            let colorSet;
            if(item[0].qState === 'S') {
              colorSet = layout.props.button.active;
              button.setAttribute('data-selected', 1);
              button.classList.add('btn-selected');
            } else {
              colorSet = layout.props.button.inactive;
            }
            setButtonCSS(button.style, colorSet);

            container.appendChild(button);
          }

          container.style.justifyContent = layout.props.button.positionType;

          const setButtonCSS = (buttonStyle, set) => {
            buttonStyle.background = set.backrgoundColor.color;
            buttonStyle.color = set.fontColor.color;
            buttonStyle.border = '1px solid ' + set.borderColor.color;
            buttonStyle.borderRadius = set.borderRound + 'px';
          }
          
          data.forEach(item => {
            drawBtn(item);
          });


          // !поменять на onclick
          container.addEventListener('click', function (e) {
              // получаем qElemNumber из атрибута кнопки
              let value = Number(e.target.getAttribute('data-value'))
             // если этот атрибут является числом, то фильтруем
              if (!isNaN(value)) {
                const isSelected = Boolean(e.target.getAttribute('data-selected'));
                self.backendApi.selectValues(0, [value], isSelected);
              }
            })
          

          container.className = 'buttons-container';



          console.log(layout);
        }
        catch (error) {
          console.log('!error', error);
        }
        return qlik.Promise.resolve();
      }
    };

} );

