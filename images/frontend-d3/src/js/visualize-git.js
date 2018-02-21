(function () {
    console.log("Ready to have fun with D3.js");

    function loadData(cb) {
        console.log("Loading data via REST API");
        d3.json("http://localhost:3000", cb);
    }

    function doSequenceOfTasks(tasksAreDone) {
        d3.queue()
            .defer(loadData)
            .await(tasksAreDone);
    }

    var margin = { top: 20, right: 20, bottom: 50, left: 150 };
    var width = 960 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    doSequenceOfTasks(function (err, data) {
        if (err) {
            console.log("Could not load data");
            console.log(err);
        } else {
            var boundaries = d3.extent(data, d => d.commits);
            var contributionsScale = d3.scaleLog()
                .domain(boundaries)
                .range([3,30])

            var colorScale = d3.scaleLinear()
                .domain(boundaries)
                .range(["darkred","darkgreen"]);

            var yScale = d3.scaleLog()
                .domain(boundaries)
                .range([0, height]);
            var yAxis = d3.axisLeft(yScale);

            svg.append("g").call(yAxis);

            svg.append("g")
                .attr("class", "watermark")
                .append("text")
                    .attr("x", width / 2)
                    .attr("y", height / 2)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .text("git contributors");

            svg.selectAll("circle")
                .data(data)
                .enter()
                  .append("circle")
                    .attr("opacity", "0.7")
                    .attr("fill", function(d) { return colorScale(d.commits)})
                    .attr("cx", function(d) { return Math.random() * width })
                    .attr("cy", function(d) { return yScale(d.commits) })
                    .attr("r", function(d) { return contributionsScale(d.commits) });
        }
    });

})();
