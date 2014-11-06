angular.module('OverviewBarChart',[])
.controller('OverviewBarChartCtrl',['$scope','$http','$log',function($scope,$http,$log){

    var dataPoints = [];

var margin = {top: 40, right: 60, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
.range(["", "", "", "", "", "", "", "", "",""]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Total Time:</strong> <span style='color:red'>" + d.time + "</span>";
});

var lastSelected = null;
var setActive = function(element,data){
    if(lastSelected){
        d3.select(lastSelected).classed('selected',false);
    }
    d3.select(element).classed('selected',true);
    lastSelected = element;
    console.log(JSON.stringify(data));
    $scope.$emit('BarChartOverviewPartitionSelected',data.partition);
};

    $scope.$on('TestRunSelected',function(e,testRun){
        dataPoints = testRun;

        var svg = d3.select(".OverviewBarChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        var set = getSet(dataPoints);
        var data = getSet(dataPoints);


            var largestY = d3.max(data,function(d){return d.time;});
            var largestPart = d3.max(data,function(d){return d.partition;});
            data.push({
                partition: largestPart + 1,
                time: largestY,
                sendToStream: largestY / 9,
                between1: largestY / 9,
                writeToDisk: largestY / 9,
                between2: largestY / 9,
                sendToBLP: largestY / 9,
                blpLogic: largestY / 9,
                sendToStore: largestY / 9,
                setModel: largestY / 9,
                sendToClient: largestY / 9
            })

            //this maps a color to an event name
            color.domain(d3.keys(data[0]).filter(function(key) {
                return /*key !== 'time' &&*/ key !== 'partition'; }));

            y.domain([0, d3.max(data, function(d) { return d.time; })]);

            data.forEach(function(d) {
                var y0 = 0;
                d.byEvent = color.domain().map(function(name) {

                    if(name === 'time'){
                        return {
                            name: 'time',
                            y0: 0,
                            y1: d.time
                        };
                    }

                    //y0 is treated like an accumulator
                    var evtLength = d[name];

                    var _mapped = {
                        name: name,
                        y0: y0,
                        y1: y0 + evtLength
                    };

                    y0 = y0 + evtLength;

                    return _mapped;
                });
            });

          x.domain(data.map(function(d) { return d.partition; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            //see this for info on rotating x-axis labels: http://www.d3noob.org/2013/01/how-to-rotate-text-labels-for-x-axis-of.html
            .selectAll("text").remove();

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis);

            var state = svg.selectAll(".state")
                .data(data)
                .enter().append("g")
                .attr("class", "state")
                .attr("transform", function(d) {
                  return "translate(" + x(d.partition) + ",0)";
                });

          state.selectAll("rect")
              .data(function(d) { return d.byEvent; })
            .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.y1); })
              .attr("class",function(d){ return d.name + '_bar'; })
              .attr("height", function(d) {
                  return y(d.y0) - y(d.y1);
              });

          var legend = svg.select(".state:last-child").selectAll(".legend")
              .data(function(d) {
                  return d.byEvent;
                })
            .enter().append("g")
              .attr("class", "legend")
              .attr("class", function(d){ return d.name + '_legend'; })
              .attr("transform", function(d) { return "translate(" + x.rangeBand() / 2 + "," + y((d.y0 + d.y1) / 2) + ")"; });

            svg.select('.time_legend').remove();

          legend.append("line")
              .attr("x2", 10);

          legend.append("text")
              .attr("x", 13)
              .attr("dy", ".35em")
              .text(function(d) { return d.name; });

            svg.selectAll(".time_bar")
                .data(data)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .on('click',function(dataPoint){
                    //console.log(JSON.stringify(data));
                    setActive(this,dataPoint);
                });


    });

}])
;
