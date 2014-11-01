angular.module('PaginatedGrid',[])
.controller('PaginatedGridCtrl',['$scope','$http','$log',function($scope,$http,$log){


    var dataPoints = [];

    $scope.headerRow = [];
    $scope.ranges = [];
    $scope.selectedRange = {};

    $scope.setRange = function(range){
        $scope.selectedRange = range;

        $scope.dataPoints = getRange(dataPoints,range.begin,range.end);
        $scope.headerRow = [_.last($scope.dataPoints)];
    };

    $scope.$on('TestRunSelected',function(e,testRun){
        dataPoints = testRun;
        //on new dataset
        $scope.ranges = getRangePartitions(dataPoints.length,500);
        $scope.setRange(_.first($scope.ranges));
    });

}])
;
