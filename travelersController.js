var mongoose = require('mongoose');
var Traveler = require('./traveler');

exports.getAllTravelers = function(req,res) {
    var query = Traveler.find({});
    query.exec(function(err,traveler){
        console.log(traveler);
    }); 
}

exports.updateUserData = function(startDate, endDate, startPt, dir, segments){
    console.log(segments[0].indx);
    /*var end = 0;
    if(dir == "north")
    {
        for(var i=0; i<6; ++i)
        {
            if(segments[i] === undefined)  continue;
                else if((segments[i].indx)>end)
                end = (segments[i].indx);
        }
        console.log(end);
    }
    var endPt = (segments[end].seg_end);
    console.log(endPt);
    */
    
    var query = Traveler.findOne().where('email', 'haim.gmail.com');
    var routeJson = '{"start_date": "' + startDate + '",';      
    routeJson += '"end_date": "' + endDate + '",';
    routeJson += '"start_pt": "' + startPt + '",';
    routeJson += '"end_pt": "בלה",';
    routeJson += '"direction": "' + dir + '",';
    routeJson += '"segments": '+ JSON.stringify(segments) +'}';
    console.log(routeJson);
    console.log(segments);
    var newRouteJson = JSON.parse(routeJson);
    query.exec(function(err,doc){
        //doc.set('segments', segments);
        doc.set('routes', newRouteJson);
        doc.save();
    });
}

exports.getTravelerRoute = function(callback) {
    var query = Traveler.findOne().where('email', 'haim.gmail.com');
    query.exec(function(err,traveler){
        //console.log(traveler.segments);
        //console.log(traveler.routes[0].start_date);
        //console.log(traveler.routes[0].end_date);
        /*var newJson = '{"segments": [' + JSON.stringify(traveler.segments) +'],';
        newJson+= '"start_date": "' + traveler.routes[0].start_date +'",';
        newJson+= '"end_date": "' + traveler.routes[0].end_date +'"}';
        console.log(newJson);
        var newSegmentsJson = JSON.parse(newJson);
        callback(newSegmentsJson);*/
        //callback(traveler.routes[0].segments);
        callback(traveler.routes); 
    }); 
}