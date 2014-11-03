var getRange = function(arr,start,end){
    //examples 1-100, 101-200
    return _.take(_.rest(arr,start-1),(end - start + 1));
};

var getRangePartitions = function(len,by){
    var toReturn = [];
    var ends = [];
    var currStart = 1;

    while(currStart < len){
        var _range = {
            begin: currStart,
            end: currStart + (by - 1)
        };

        if(_range.end > len) _range.end = len;

        currStart = _range.end + 1;

        toReturn.push(_range);
    }

    return toReturn;
};

var getAverage = function(arr,selector){
    var avgAcc = _.reduce(arr,
        function(acc,point){
            acc.count++;
            acc.sum += selector(point);
            return acc;
        },{count: 0, sum: 0});

    var average = avgAcc.sum / avgAcc.count;
    return average;
};

/*
TotalTime: evt.perfClientReceived - evt.perfClientSent,
SendToStream: evt.perfStreamReceived - evt.perfClientSent,
Between1: evt.perfBeginCommit - evt.perfStreamReceived,
WriteToDisk: evt.perfEndCommit - evt.perfBeginCommit,
Between2: evt.perfPublishEvent - evt.perfEndCommit,
SendToBLP: evt.perfPublishReceived - evt.perfPublishEvent,
BLPlogic: evt.perfSendToStore - evt.perfPublishReceived,
SendToStore: evt.perfStoreReceived - evt.perfSendToStore,
SetModel: evt.perfNotifyModelChange - evt.perfStoreReceived,
SendToClient: evt.perfClientReceived - evt.perfNotifyModelChange,
*/

var getSet = function(arr){
    var toReturn = [];

    var partitions = getRangePartitions(arr.length,100);

    toReturn = _.map(partitions,function(part,idx){

        var _range = getRange(arr,part.begin,part.end);

        var avgTotalTime = getAverage(_range,function(d){ return d.TotalTime; });

        return {
            partition: idx,
            sendToStream: getAverage(_range,function(d){ return d.SendToStream }),
            between1: getAverage(_range,function(d){ return d.Between1 }),
            writeToDisk: getAverage(_range,function(d){ return d.WriteToDisk }),
            between2: getAverage(_range,function(d){ return d.Between2 }),
            sendToBLP: getAverage(_range,function(d){ return d.SendToBLP }),
            blpLogic: getAverage(_range,function(d){ return d.BLPlogic }),
            sendToStore: getAverage(_range,function(d){ return d.SendToStore }),
            setModel: getAverage(_range,function(d){ return d.SetModel }),
            sendToClient: getAverage(_range,function(d){ return d.SendToClient }),
            time: avgTotalTime
        };
    });

    return toReturn;
};

var getDataPoints = function(arr){
    return _.map(arr,function(e){
        var evt = e._metadata;
        var _newEvt = {
            streamOrder: evt.streamOrder,
            eventId: evt.eventId,

            TotalTime: evt.perfClientReceived - evt.perfClientSent,
            SendToStream: evt.perfStreamReceived - evt.perfClientSent,
            Between1: evt.perfBeginCommit - evt.perfStreamReceived,
            WriteToDisk: evt.perfEndCommit - evt.perfBeginCommit,
            Between2: evt.perfPublishEvent - evt.perfEndCommit,
            SendToBLP: evt.perfPublishReceived - evt.perfPublishEvent,
            BLPlogic: evt.perfSendToStore - evt.perfPublishReceived,
            SendToStore: evt.perfStoreReceived - evt.perfSendToStore,
            SetModel: evt.perfNotifyModelChange - evt.perfStoreReceived,
            SendToClient: evt.perfClientReceived - evt.perfNotifyModelChange,

            perfClientSent: evt.perfClientSent,
            perfStreamReceived: evt.perfStreamReceived,
            perfBeginCommit: evt.perfBeginCommit,
            perfEndCommit: evt.perfEndCommit,
            perfPublishEvent: evt.perfPublishEvent,
            perfPublishReceived: evt.perfPublishReceived,
            perfSendToStore: evt.perfSendToStore,
            perfStoreReceived: evt.perfStoreReceived,
            perfNotifyModelChange: evt.perfNotifyModelChange,
            perfClientReceived: evt.perfClientReceived
        };
        return _newEvt;
    });
};
