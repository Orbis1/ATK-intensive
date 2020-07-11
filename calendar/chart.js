requirejs.config({
  paths: {
    'd3': '/extensions/calendar/d3',
    'd3-interpolate': '/extensions/calendar/d3-interpolate',
    'd3-color': '/extensions/calendar/d3-color',
    'd3-scale-chromatic': '/extensions/calendar/d3-scale-chromatic'
  }
});

define([
  "./d3",
  "./d3-color",
  "./d3-interpolate",
  "./d3-scale-chromatic",
], function (d3) {



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
      .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
      .attr("y", d => countDay(d.date) * cellSize + 0.5)
      .attr("fill", d => color(d.value))
      .append("title")
      .text(d => `${formatDate(d.date)}
  ${formatValue(d.value)}`);

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
});