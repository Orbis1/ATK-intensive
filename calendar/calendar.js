define( [ "qlik", , "text!./template.html", "css!./calendar.css"
],
function (qlik, template) {

    return {
        template: template,

        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 5,
                    qHeight: 1000
              }]
            }
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
                    max: 2,
                    items: {
                        tooltip: {
                            label: "Всплывающая подсказка",
                            type: "string",
                            ref: 'qAttributeExpressions.0.qExpression',
                            component: "expression",
                            defaultValue: "",
                        },
                    }   
                },

                sorting: {
                    uses: "sorting"
                },

                settings: {
                    uses: "settings",
                    items: {
                      view: {
                        label: "Вид",
                        type: "items",
                        items: {

                            palette: {
                                type: 'string',
                                label: "Палитра",
                                ref: "props.palette",
                                component: 'dropdown',
                                options: [
                                  {
                                    label: 'Розово-зеленая',
                                    value: 'pink-green'
                                  },
                                  {
                                    label: 'Фиолетово-зеленая',
                                    value: 'purple-green'
                                  },
                                  {
                                    label: 'Красно-синяя',
                                    value: 'red-blue'
                                  },
                                  {
                                    label: 'Красно-зеленая',
                                    value: 'red-green'
                                  },
                                  {
                                    label: 'Серая',
                                    value: 'gray'
                                  },
                                  {
                                    label: 'Зеленая',
                                    value: 'green'
                                  },
                                ],
                                defaultValue: 'pink-green'
                            },
                            
                            legendPosition: {
                                type: 'string',
                                label: "Позиция легенды",
                                ref: "props.legendPosition",
                                component: 'dropdown',
                                options: [{
                                    label: 'Вверху',
                                    value: 'up' 
                                },
                                {
                                    label: 'Внизу',
                                    value: 'down'
                                    }],
                                defaultValue: 'up'
                            },

                            isFilter: {
                                type: 'boolean',
                                label: "Фильтровать по значению",
                                ref: "props.isFilter",
                                component: 'switch',
                                options: [
                                  {
                                    label: 'Да',
                                    value: true
                                  },
                                  {
                                    label: 'Нет',
                                    value: false
                                  },
                                ],
                                defaultValue: false
                            },




                        }
                      },

                      tooltip: {
                        label: "Всплывающая подсказка",
                        type: "items",
                        items: {
                          tooltipColor: {
                            label: "Цвет текста",
                            type: "string",
                            ref: 'props.tooltipColor',
                            expression: "optional",
                            defaultValue: "gray"
                          },
                          tooltipFontSize: {
                            label: "Размер текста",
                            type: 'number',
                            ref: 'props.tooltipFontSize',
                            expression: "optional",
                            defaultValue: 12
                          },
                          tooltipBg: {
                            label: "Цвет фона",
                            type: "string",
                            ref: 'props.tooltipBg',
                            expression: "optional",
                            defaultValue: "lightblue"
                          },
                        }
                      }
                    }
                }
            }
        },

        support : {
            snapshot: true,
            export: true,
            exportData : false
        },

        paint: function ($element, layout) {
            try {
                //add your rendering code here
                $element.html( "calendar" );
                console.log('layout', layout);
            }
            catch (error) {
                console.log(error);
            }
            //needed for export
            return qlik.Promise.resolve();
        }
    };

} );

