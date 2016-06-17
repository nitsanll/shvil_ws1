var express = require('express');
var app = express();
var Segment = require('./segmentsController');
var Traveler = require('./travelersController');
var port = process.env.PORT || 3000;

app.set('port', port);
app.use('/',express.static('./public'));
app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    app.set('json spaces', 4);
    res.set("Content-Type", "application/json");
    next();
});

app.get('/getSegments', function(req,res){
   Segment.getAllSegments(function(segs){
     res.json(segs);
   }); 
});

app.get('/updateTraveler', function(req,res){
    Traveler.updateUserData(startDate, endDate, startPt, endPt ,dir, segments);
});

app.get('/calculate/:sd/:ed/:sp/:dir/:km', function(req,res){
    Segment.calculateRoute(req.params.sd,req.params.ed,req.params.sp,req.params.dir,req.params.km, function(segs){
         Traveler.updateUserData(req.params.sd,req.params.ed,req.params.sp,req.params.dir, segs);
         res.json(segs);
    });
});

app.get('/getTravelerRoute', function(req,res){
    Traveler.getTravelerRoute(function(data){
      res.json(data); 
    });
});

app.listen(port);
console.log("service is lstening on port " + port);
