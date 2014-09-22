var schemas = require('./db.js');
var express = require('express');
var request = require('request');
var router = express.Router();
var User = schemas.userSchema;
var Friend = schemas.friendSchema;
var drawing = require('../public/js/sphere_graph')

router.get("/", function (req,res){
  res.render("home");
});

router.post("/",function (req,res){
  res.end("successful post response");
});

router.get('/friends', function(req, res){
  res.render('globe');
})

router.get('/api/friends', function(req, res){
  var data = [
  {name: 'john', latitude: 44, longitude: 77},
  {name: 'sam', latitude: 22, longitude: 120}
  ];
  data = JSON.stringify(data);
  res.end(data)
});

router.post('/save-user', function(req, res){
  var userData = req.body.user;
  userData = userData[0];
  User.findOneAndUpdate({fbId: userData.uid},{
    first_name: userData.first_name,
    last_name: userData.last_name,
    fbId: userData.uid,
    latitude: userData.current_location.latitude,
    longitude: userData.current_location.longitude,
    },{upsert: true}, function(err, data){
      if(err) console.log(err);
      console.log(data);
      res.end();
    })
});

router.post('/save-friends', function(req, res){
  var friendData = req.body.response;
  friendData = JSON.parse(friendData);
  friendData = friendData.data;
  var saveFriends = function(friendData){
    var current = friendData.pop();
    Friend.findOneAndUpdate({ fbId: current.uid },{
      name: current.name,
      fbId: current.uid,
      latitude: (current.current_location !== null) ? current.current_location.latitude : null,
      longitude: (current.current_location !== null) ? current.current_location.longitude : null,
      picture_url: current.pic_square
    },{upsert: true}, function(err, data){
      if(err) console.log(err);
      console.log(data)
      if(friendData.length){
        return saveFriends(friendData);
      } else {
        res.end();
      }
    })
  }
  saveFriends(friendData);
});

router.post('/save-checkins', function(req, res){
  var data = req.body.friends;
  console.log(data);
  res.end();
})

module.exports = router;