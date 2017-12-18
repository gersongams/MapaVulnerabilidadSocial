var barwidth = 120;
var barheight = 14;
var color_range = [
  "#f0f8ff",
  "#a1caf1",
  "#99badd",
  "#71a6d2",
  "#5b92e5",
  "#007fff",
  "#5d8aa8",
  "#4682b4",
  "#081d58"
];
var width = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, 70]);
var data_bins = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 1];
var colorScale = d3
  .scaleLinear()
  .domain(data_bins)
  .range(color_range);

var container = d3.select("#overlay-ses");

//<img src="icons/flag.svg" onerror="this.src='icon/flag.png'" style="width:12px;height:12px;">

var layout = [
  {
    title: "Estatus Socioeconomico",
    items: [
      { title: "Debajo de la pobreza", code: "EPL_POV" },
      { title: "Desempleado", code: "EPL_UNEMP" },
      { title: "Bajos recursos", code: "EPL_PCI" },
      { title: "No termino las secundaria", code: "EPL_NOHSDP" }
    ]
  },
  {
    title: "Composición del hogar",
    items: [
      { title: "De 65 años o más", code: "EPL_AGE65" },
      { title: "17 años o menos", code: "EPL_AGE17" },
      { title: "Civil con discapacidad", code: "EPL_DISABL" },
      { title: "Hogares monoparentales", code: "EPL_SNGPNT" }
    ]
  },
  {
    title: "Estado de minoría",
    items: [
      { title: "Minoría", code: "EPL_MINRTY" },
      { title: "Habla inglés mas o menos", code: "EPL_LIMENG" }
    ]
  },
  {
    title: "Vivienda y transporte",
    items: [
      { title: "Multiestructurañ", code: "EPL_MUNIT" },
      { title: "Casas móviles", code: "EPL_MOBILE" },
      { title: "Concurrente", code: "EPL_CROWD" },
      { title: "Sin vehiculos", code: "EPL_NOVEH" }
    ]
  }
];

//function updateSidebarTitle(title) {
// $('#overlay-title').text(title)}

function updateSidebar(options) {
  console.log(options);
  layout.forEach(function(category) {
    category.items.forEach(function(item) {
      item.value = options[item.code] || options[item.code.substring(0, 7)];
    });
  });

  d3.select("#location").text("Localización: " + options.LOCATION);

  d3.select("#F_Total-bignumber").text(options.F_TOTAL);
  d3.select("#population").text(function(d) {
    return "Población " + d3.format(",")(options.E_TOTPOP);
  });
  d3.select("#diocese").text(function(d) {
    return "Catholic Diocese: " + options.Diocese;
  });

  var categories = container
    .selectAll("div.category")
    .data(layout, function(d) {
      return d.title;
    });

  var categoryEnter = categories
    .enter()
    .append("div")
    .attr("class", "category");

  categoryEnter
    .append("div")
    .append("h5")
    .text(function(category) {
      return category.title;
    });

  var items = categories
    .merge(categoryEnter)
    .selectAll("div.item")
    .data(
      function(data) {
        return data.items;
      },
      function(data) {
        return data.title;
      }
    );

  var itemEnter = items
    .enter()
    .append("div")
    .attr("class", "item cf");

  itemEnter
    .append("div")
    .attr("class", "item-title fl w-50")
    .text(function(category) {
      return category.title;
    });

  itemEnter.append("div").attr("class", "item-number fl w-10");
  items = items.merge(itemEnter);

  var img = items.selectAll("div.flag-col").data(function(data) {
    return data.value > 0.9 ? [data] : [];
  });

  img.exit().remove();

  var svg = items.selectAll("g").data(function(data) {
    return [data];
  });

  svg.selectAll(".point").remove();

  var svgEnter = svg
    .enter()
    .append("div")
    .attr("class", "fl w-30")
    .append("svg")
    .attr("width", barwidth + 2)
    .style("vertical-align", "top")
    .attr("height", barheight + 2)
    .append("g")
    .attr("transform", "translate(2, 2)");

  svgEnter
    .append("rect")
    .attr("class", "bar")
    .attr("height", 12)
    .attr("width", 0)
    .style("fill", "#fff");

  svgEnter
    .append("rect")
    .attr("class", "bar-background")
    .attr("height", 12)
    .attr("width", width(1))
    .style("stroke", "#ccc")
    .style("fill", "transparent");

  svgEnter
    .append("svg")
    .attr("class", "flag")
    .attr("y", 12)
    .style("fill", "#ffffff");

  svg = svg.merge(svgEnter);
  items = items.merge(itemEnter);

  svg
    .select("rect.bar")
    .transition()
    .duration(300)
    .attr("width", function(d) {
      return d.value !== undefined ? width(d.value) : width(1);
    })
    .style("fill", function(d) {
      return d.value !== undefined
        ? colorScale(d.value)
        : "rgba(0, 0, 0, 0.85)";
    });

  items.select("div.item-number").text(function(d) {
    return d.value === undefined ? "N/A" : d3.format(".2f")(d.value);
  });
}

updateSidebar({});
