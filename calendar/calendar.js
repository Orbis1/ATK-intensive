requirejs.config({
  paths: {
    'd3': '/extensions/calendar/d3',
    'd3-interpolate': '/extensions/calendar/d3-interpolate',
    'd3-color': '/extensions/calendar/d3-color',
    'd3-scale-chromatic': '/extensions/calendar/d3-scale-chromatic',
  }
});

define(
  [
    "qlik",
    "text!./template.html",
    "./d3",
    "./d3-color",
    "./d3-interpolate",
    "./d3-scale-chromatic",
    "css!./calendar.css",
  ],
function (qlik, template, d3, test) {

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
                            
                            valueRound: {
                              type: "integer",
                              component: "slider",
                              label: 'Знаков после запятой',
                              ref: "props.valueRound",
                              defaultValue: 2,
                              min: 0,
                              max: 10,
                              step: 1
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
              const self = this;
              const wrapper = $element[0].querySelector('.calendar-wrapper')
              const container = $element[0].querySelector('.calendar-container')
              container.innerHTML = '';


              let data = layout.qHyperCube.qDataPages[0].qMatrix.map((d) => {
                if (d[0].qText !== '-') {
                  return {
                    date: new Date(d[0].qText),
                    value: d[1].qNum,
                    tooltip: d[1].qAttrExps !== undefined && d[1].qAttrExps.qValues[0].qText !== undefined 
                      ? d[1].qAttrExps.qValues[0].qText 
                      : d[1].qText,
                    qElemNumber: d[0].qElemNumber,
                    isSelected: d[0].qState === 'S'
                  }
                }
              });

              data = data.filter(function (d) {//
                return d !== undefined;
              })
              
              var palette = {
                'pink-green': d3.interpolatePiYG,
                'purple-green': d3.interpolatePRGn,
                'red-blue': d3.interpolateRdBu,
                'red-green': d3.interpolateRdYlGn,
                'green': d3.interpolateGreens,
                'red': d3.interpolateReds,
                'gray': d3.interpolateGreys
              }

              const chousenColor = layout.props.palette;

              const years = d3.nest()
                              .key(function (d) {
                                return d.date.getFullYear()
                              })
                              .entries(data)
                              .reverse()
              const selectedCount = data.filter(d => d.isSelected).length;

              
              var weekday = 'monday';
              var cellSize = 17;
              var width = 954;
              var height = cellSize * 9;
              var timeWeek = weekday === "sunday" ? d3.utcSunday : d3.utcMonday;
              var countDay = weekday === "sunday" ? d => d.getUTCDay() : d => (d.getUTCDay() + 6) % 7;
              
              function pathMonth(t) {
                const n = 7;
                const d = Math.max(0, Math.min(n, countDay(t)));
                const w = timeWeek.count(d3.utcYear(t), t);
                return `${d === 0 ? `M${w * cellSize},0`
                  : d === n ? `M${(w + 1) * cellSize},0`
                    : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
              }
              
              var formatValue = d3.format(`.${layout.props.valueRound}f`);
              var formatDate = d3.utcFormat("%x");
              var formatDay = d => "SMTWTFS"[d.getUTCDay()];
              var formatMonth = d3.utcFormat("%b");
              // var max = d3.quantile(data.map(d => Math.abs(d.value)).sort(d3.ascending), 0.9975); 
              var max = d3.max(data.map(d => d.value));
              var min = d3.min(data.map(d => d.value));
              var color = d3.scaleSequential(palette[chousenColor]).domain([min, max]);
              const colorGray = d3.scaleSequential(d3.interpolateRgb("rgb(150, 150, 150)", "rgb(50, 50, 50)")).domain([min, max]);

              const boundaryValues = [min, max];

              wrapper.style.flexDirection = layout.props.legendPosition === 'up'
                ? 'column'
                : 'column-reverse';

              const items = wrapper.querySelectorAll('.calendar-legend-item');
              items.forEach(function (el, i) {
                el.querySelector('.calendar-legend-color').style.background = color(boundaryValues[i]);
                el.querySelector('.calendar-legend-label').innerHTML = formatValue(boundaryValues[i]);
              })

              let tooltip = d3.select('.calendar-tooltip');
              if (tooltip.node() === null) {
                tooltip = d3.select("body").append("div")
                  .attr("class", "calendar-tooltip")
                  .style("opacity", 0)
              } else {
                tooltip.style.opacity = 0;
              }
              tooltip
                .style('font-size', layout.props.tooltipFontSize + 'px')
                .style('color', layout.props.tooltipColor)
                .style('background', layout.props.tooltipBg)
              ;
          
              function chart(years) {
                const svg = d3.create("svg")
                  .attr("viewBox", [0, 0, width, height * years.length])
                  .attr("font-family", "sans-serif")
                  .attr("font-size", 10);
              
                const year = svg.selectAll("g")
                  .data(years)
                  .join("g")
                  .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);
              
                year.append("text")
                  .attr("x", -5)
                  .attr("y", -5)
                  .attr("font-weight", "bold")
                  .attr("text-anchor", "end")
                  .text(function (d) {
                    return d.key
                  })
              
                year.append("g")
                  .attr("text-anchor", "end")
                  .selectAll("text")
                  .data((d3.range(7)).map(i => new Date(1995, 0, i)))
                  .join("text")
                  .attr("x", -5)
                  .attr("y", d => (countDay(d) + 0.5) * cellSize)
                  .attr("dy", "0.31em")
                  .text(formatDay);
              
                year.append("g")
                  .selectAll("rect")
                  .data(function (d) {
                      return d.values
                  })
                  .join("rect")
                  .attr("width", cellSize - 1)
                  .attr("height", cellSize - 1)
                  .on("click", (d) => {
                    self.backendApi.selectValues(0, [d.qElemNumber], d.isSelected);
                  })
                  .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
                  .attr("y", d => countDay(d.date) * cellSize + 0.5)

                  .attr("fill", d => selectedCount 
                                        ? d.isSelected 
                                            ? color(d.value) 
                                            : colorGray(d.value)
                                        : color(d.value))

                  // .attr("opacity", d => selectedCount 
                  //                       ? d.isSelected 
                  //                           ? 1 
                  //                           : 0.25
                  //                       : 1)
                  .on("mouseover", function (d) {
                    tooltip.transition()
                      .duration(200)
                      .style("opacity", 1);
                                      tooltip.html(formatDate(d.date) + "<br/>" + formatValue(d.value))
                      .style("left", (d3.event.pageX) + 20 + "px")
                      .style("top", (d3.event.pageY - 20) + "px");
                    })
                  .on("mouseout", function (d) {
                    tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
                  })
                  .text(d => `${formatDate(d.date)}
              ${formatValue(d.value)}`);

                d3.select('.calendar-container')
                .on('scroll', function () {
                  tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
                })
              
                const month = year.append("g")
                  .selectAll("g")
                  .data(function (d) {
                    return d3.utcMonths(d3.utcMonth(d.values[0].date), d.values[d.values.length - 1].date)
                  })
                  .join("g");
              
                month.filter((d, i) => i).append("path")
                  .attr("fill", "none")
                  .attr("stroke", "#fff")
                  .attr("stroke-width", 3)
                  .attr("d", pathMonth);
              
                month.append("text")
                  .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
                  .attr("y", -5)
                  .text(formatMonth);
              
                return svg.node();
              }
              
              container.appendChild(chart(years));
              // wrapper.appendChild(container);


                // console.log('layout', layout);

            }
            catch (error) {
                console.log(error);
            }
            //needed for export
            return qlik.Promise.resolve();
        },

    };

} );

