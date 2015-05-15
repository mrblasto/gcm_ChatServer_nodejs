/**
 * Created by jeffreyfried on 4/4/15.
 */
var express = require("express");
var bodyParser = require("body-parser");
var gcm = require('node-gcm');

var profileManager = require("./data/Profile");

app = express();


var message = new gcm.Message();

//Put your public Google API access key here
var senderId = 'abcdefghijklmnopqrxyz0123456789ABC-DEFG';


app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Clients must be registered via call to /register before they can send a message through /chat
 */
app.use(function(req,res, next){

    var email = req.body.email;

    if(req.originalUrl != "/register") {
        // authenticate using mongodb
        //console.log("authenticating via mongodb profiles: ", email)
        profileManager.findByEmail(email, function(result){
           if(result.status != "error" && result.data != null) {
               //console.log("profile: ", result.data);
               req.data = result.data;
               next();
           }
           else {
               result.status = "error";
               result.error = "not authenticated or registered";
               console.log("not authenticated or registered: ", email);
               res.json(result);
           }
        });
    }
    else {
        //pass through: to do put your authentication here
        console.log("authenticating user for ", req.originalUrl);
        next();
    }

});



//function(email, name, gender, birthdate, avatar, authToken, gcmId
//    , callback)
app.post("/register", function(req,res, next){
    console.log("email: ", req.body.email);
    console.log("reqid: ", req.body.regid);
    var gcmId = req.body.regid;
    var email = req.body.email;
    var name = req.body.name;
    authToken = req.body.authToken;
    //email, name, authToken, gcmId, avatar
    var profile = new profileManager.Profile(email
                                    , name
                                    , authToken
                                    , gcmId
                                    , null);

    profile.update(function(result){
        if(result.status != "error") {
            result.username = name;
        }
        consoler.log("registration result: ", JSON.stringify(result));
        res.json(result);
    })

});

app.post("/chat", function(req, res, next){
    console.log("post chat: ", req.body);
   profileManager.findByName(req.body.to, function(result){
      try {
          if (result.status != "error") {
              if(result.data == null) {
                  throw req.body.to + "not registered.";
              }
              req.gcmId = result.data.gcmId;
              if(req.gcmId == null) {
                  throw "Error retrieving GCM registration id. ";
              }
              console.log("GCM id: ", req.gcmId);
              next();
          }
          else {
              console.error(result.status, result.error);
              res.json(result);
          }
      }
      catch(error) {
          console.error("Error retrieving GCM registration id. ", error.toString());
          result.status = "error";
          result.error = error.toString();
          res.json(result);
      }
   });
});

app.post("/chat", function(req,res, next){
    console.log("message: ", req.body.message);
    console.log("from: ", req.data.name);
    console.log("to: ", req.body.to);

    message.addData("title", req.body.message);
    message.addData("message", req.body.message);
    message.addData("fromName", req.data.name);
    message.addData("toName", req.body.to);

    message.collapseKey = 'demo';
    message.delayWhileIdle = true;
    message.timeToLive = 2419200;

    var sender = new gcm.Sender(senderId);
    var gcmId = req.gcmId;

    var resultObj = new Object();
    resultObj.status = "ok";

    if(gcmId == null || gcmId.length <= 0) {
        resultObj.status = "error";
        resultObj.error = "null gcmId";
        console.error("/chat: ", "null gcmId");
        //console.error("req.data: ", req.data);
        res.json(resultObj);
        return;
    }

    var registrationIds = [];

    registrationIds.push(gcmId);

    console.log("gcm: ", registrationIds);

    sender.send(message, registrationIds, function (err, result) {
        if(err) {
            console.error("gcm error: ", err);
            resultObj.status = "error";
            resultObj.error = err;
        }
        else {
            console.log(result);
            resultObj.data = result;
        }
        res.json(resultObj);
    });

});


var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('chat server started at http://%s:%s', host,port);
});