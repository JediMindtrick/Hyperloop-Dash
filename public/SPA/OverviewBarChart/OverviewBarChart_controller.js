angular.module('OverviewBarChart',[])
.controller('OverviewBarChartCtrl',['$scope','$http','$log',function($scope,$http,$log){

    var dataPoints = [];

    var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 1200 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

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

        x.domain(_.map(set,function(d) { return d.partition; }));
        y.domain([0, d3.max(set, function(d) { return d.time; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            //see this for info on rotating x-axis labels: http://www.d3noob.org/2013/01/how-to-rotate-text-labels-for-x-axis-of.html
            .selectAll("text")
                .style("text-anchor","end")
                .attr("dx","-.8em")
                .attr("dy",".15em")
                .attr("transform",function(d){
                    return "rotate(-90)";
                });

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform","translate(18,0)")//moves the y-axis closer to the data
            .call(yAxis)
          .append("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)//moves the y-axis label left or right
            .attr("dy", ".71em")
            .text("Milliseconds");

        svg.selectAll(".bar")
            .data(set)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.partition); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.time); })
            .attr("height", function(d) { return height - y(d.time); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .on('click',function(data){
                setActive(this,data);
            });
    });

}])
;
