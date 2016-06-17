var mongoose = require('mongoose');
var Segment = require('./segment');

var firstIndx;
exports.getAllSegments = function(callback) {
    var getSegments = getSegmentsNow(callback); 
    function getSegmentsNow(callback){
        var query = Segment.find({}).select('seg_start seg_end');
        query.exec(function(err,segment){
            console.log(segment);
            callback(segment);
        });  
    }  
}

exports.calculateRoute = function(startDate, endDate, startPt, dir, kmDay, callback){
    
    var totalDays, totalKm, numOfSegs, firstSeg, lastIndx;
    var segArr;
    totalDays = calculateDates();
    totalKm = totalDays * kmDay;
    numOfSegsUser = totalKm / kmDay;
    numOfSegs = totalKm / 5;
    if(numOfSegs > 6) {numOfSegs = 6;}
    //console.log("numOfSegs " + numOfSegs);
    if(((kmDay == 5) && (totalDays>numOfSegs)))
    {
        while(totalDays>numOfSegs) totalDays=totalDays-1;
    } else if ((kmDay == 10 && totalDays>(numOfSegs/2)))
    {
        while(totalDays>(numOfSegs/2)) totalDays=totalDays-1;  
    } else if(kmDay == 15 && totalDays>(numOfSegs/3))
    {
        while(totalDays>(numOfSegs/3)) totalDays=totalDays-1;  
    }
    console.log(totalDays);
    var first = getFirstSegIndex(callback); 

    function getFirstSegIndex(callback){
        if(dir == "north"){
            var firstSeg = Segment.find({'seg_start':startPt}).select('indx');   
        }
        else if(dir == "south"){
            var firstSeg = Segment.find({'seg_end':startPt}).select('indx');
        }
        firstSeg.exec(function(err,segment){
            firstIndx = segment[0].indx;
            //console.log(firstIndx);
            calcEndSeg(firstIndx, callback);
        });
    }

    function calcEndSeg(firstIndx, callback){
        if(dir == "north") {
            lastIndx = firstIndx + (numOfSegs - 1);
        }
        else if(dir == "south") {
            lastIndx = firstIndx - (numOfSegs - 1);
        }
        getSegs(firstIndx, lastIndx, callback);
    }

    function getSegs(firstIndx, lastIndx, callback){
        if(dir=="north"){
          segArr = Segment.find({}).where('indx').gt(firstIndx-1).lt(lastIndx+1).select('seg_start seg_end indx');  
        } else if(dir=="south"){
          segArr = Segment.find({}).where('indx').gt(lastIndx-1).lt(firstIndx+1).select('seg_start seg_end indx');  
        }
        segArr.exec(function(err,segment){
            //console.log(segment.length);
            //console.log(dir);
             if(dir == "north"){
                 if(kmDay == 5) callback(segment);
                 if(kmDay == 10)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=0; i<=lastIndx; i+=2,j+=2)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_start +'",'; 
                        newJson+='"seg_end": "' + segment[j+1].seg_end + '"},'; 
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    //console.log(newSegments);
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }
                 if(kmDay == 15)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=0; i<=lastIndx; i+=3,j+=3)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_start +'",'; 
                        newJson+='"seg_end": "' + segment[j+2].seg_end + '"},';
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    //console.log(newSegments);
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }
            } else if(dir =="south"){
                if(kmDay == 5)
                { 
                    var newSegments = "[";
                    for(var i = firstIndx, j=(segment.length)-1; i>=lastIndx; i-=1,j-=1)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_end +'",'; 
                        newJson+='"seg_end": "' + segment[j].seg_start + '"},'; 
                        newSegments+=newJson;
                        //console.log(newJson);
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    //console.log(newSegments);
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                }
                 if(kmDay == 10)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=(segment.length)-1; i>=lastIndx; i-=2,j-=2)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_end +'",'; 
                        newJson+='"seg_end": "' + segment[j-1].seg_start + '"},'; 
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    //console.log(newSegments);
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }
                 if(kmDay == 15)
                 {
                    var newSegments = "[";
                    for(var i = firstIndx, j=(segment.length)-1; i>=lastIndx; i-=3,j-=3)
                    {
                        var newJson = '{"indx": "' + i +'",';
                        newJson+='"seg_start": "'+ segment[j].seg_end +'",'; 
                        newJson+='"seg_end": "' + segment[j-2].seg_start + '"},';
                        newSegments+=newJson;
                    }
                    newSegments = newSegments.substring(0, newSegments.length-1);
                    newSegments += ']';
                    //console.log(newSegments);
                    var newSegmentsJson = JSON.parse(newSegments);
                    callback(newSegmentsJson);
                 }
            }  
        });
    }

    function calculateDates(){
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var firstDateArr = startDate.split('.');
        var firstDate = new Date(firstDateArr[2], firstDateArr[1]-1, firstDateArr[0]);
        var secondDateArr = endDate.split('.');
        var secondDate = new Date(secondDateArr[2], secondDateArr[1]-1, secondDateArr[0]);
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
        diffDays+=1;
        return diffDays;
    }    
}