var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.route('/getAllData').get(function(request, response){
  console.log("\n *START* \n");
  var content = fs.readFileSync(__dirname+"/../public/data/userDetails.json");
  console.log("Output Content : \n"+ content);
  response.send(JSON.parse(content));
});

router.route('/getUserData').get(function(request, response){
  var name = request.query.name;
  console.log("\n *START* \n");
  var content = fs.readFileSync(__dirname+"/../public/data/userDetails.json");
  console.log("Output Content : \n"+ content);
  if(name){
    var data = JSON.parse(content).users[name];
  }
  else{
    var data = JSON.parse(content).users;
  }
  response.send(data);
});


router.route('/addData').post(function(request, response){
  var userDetails = request.body.user;
  var oldData = JSON.parse(fs.readFileSync(__dirname+"/../public/data/userDetails.json", 'utf8'));
  oldData.users[userDetails.name] = userDetails;

  var updatedData = JSON.stringify(oldData);
  fs.writeFile(__dirname+"/../public/data/userDetails.json",updatedData, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
    response.send(oldData);    
  });
});

router.route('/updateData').post(function(request, response){
  var newData = request.body.newData;
  var userName = newData.user;
  var key = newData.key;
  var data = newData.data;
  var loginUser = newData.loginUser;

  var oldData = JSON.parse(fs.readFileSync(__dirname+"/../public/data/userDetails.json", 'utf8'));
  var userDetails = oldData.users[userName];

  if(key == "likes"){
    userDetails.dweets[data].likes = Number(userDetails.dweets[data].likes)+1;
  }
  else if(key == "dislikes"){
    userDetails.dweets[data].dislikes = Number(userDetails.dweets[data].dislikes)+1;
  }
  else if(key == "dweets"){
    userDetails.dweets.push(data);
  }
  else if(key == "followers"){
    userDetails.followers.push(data);
  }

  var updatedData = JSON.stringify(oldData);
  fs.writeFile(__dirname+"/../public/data/userDetails.json",updatedData, (err,data) => {
    if (err) throw err;

    if(loginUser){
      response.send(oldData.users[loginUser]);
    }
    else{
      response.send(userDetails);
    }
    
    console.log('The file has been saved!');
  });
});


router.route('/searchUser').post(function(request, response){
  var userName = request.body.name;

  fs.readFile(__dirname+"/../public/data/userDetails.json", 'utf8', (err, data) => {
    if (err) throw err;

    var userDetails = (JSON.parse(data)).users[userName];
    response.send(userDetails);
    console.log('The file has been saved!');
  });
});

router.route('/getFollowersDweets').post(function(request, response){
  var followers = request.body.followers;

  fs.readFile(__dirname+"/../public/data/userDetails.json", 'utf8', (err, data) => {
    if (err) throw err;

    var userDweets = [];
    var userDetails = (JSON.parse(data)).users;

    for(var i=0;i<followers.length;i++){
      var userData = userDetails[followers[i]];
        userDweets.push({
          name   : userData.name,
          dweets : userData.dweets
        });
    }

    response.send(userDweets);
    console.log('The file has been saved!');
  });
});


module.exports = router;
