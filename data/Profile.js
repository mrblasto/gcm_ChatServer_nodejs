/**
 * Created by jeffreyfried on 4/28/15.
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var exports = module.exports = {};

// Connection URL
var url = 'mongodb://localhost:27017/chatDemo';

exports.Profile = function(email, name, authToken, gcmId, avatar) {
    this.email = email;
    this.name = name;
    this.authToken = authToken;
    this.gcmId = gcmId;
    this.avatar = avatar;
    this.createdOn = new Date();
    var This = this;
    this.insert = function (callback) {
        MongoClient.connect(url, function (err, db) {
            var result = new Object({status: "ok"});
            if (err === null) {
                console.log("connect to mongo");
                var profiles = db.collection("profiles");
                profiles.insertOne(This);
            }
            else {
                result.status = "error";
                result.error = err;
                console.err("Profile.insert connect error:", err);
            }
            db.close();
            callback(result);
        });
    };
    this.update = function(callback){
        MongoClient.connect(url, function (err, db) {
            var result = new Object({status: "ok"});
            if (err === null) {
                console.log("connect to mongo");
                var profiles = db.collection("profiles");
                profiles.updateOne({email:This.email}, This, {upsert:true}
                , function(err, data){
                        if(err === null) {
                            result.data = data;
                        }
                        else {
                            result.status = "error";
                            result.error = err;
                        }
                        db.close();
                        callback(result);
                    });
            }
            else {
                result.status = "error";
                result.error = err;
                console.err("Profile.insert connect error:", err);
                db.close();
                callback(result);
            }
        });
    }
};



exports.insertProfile = function(email, name, authToken, gcmId, avatar
                            , callback) {
    var profile = new exports.Profile(email, name, authToken, gcmId, avatar);
    profile.insert(callback);
    //console.log(JSON.stringify(profile));
};


exports.findByEmail = function (email, callback) {
    MongoClient.connect(url, function (err, db) {
        var result = new Object({status: "ok"});
        if (err === null) {
            console.log("findByEmail", "connect to mongo");
            var profiles = db.collection("profiles");
            profiles.findOne({email:email}, function(err,data){
                if(err != null) {
                    result.status = "error";
                    result.error = err;
                }
                else {
                    result.data = data;
                    console.log("found data for ", email);
                }
                db.close();
                //console.log("about to callback: ");
                callback(result);
                //console.log("callback completed");
            });
        }
        else {
            result.status = "error";
            result.error = err;
            console.err("Profile.findByEmail connect error:", err);
            db.close();
            callback(result);
        }
    });
};

exports.findByName = function (name, callback) {
    MongoClient.connect(url, function (err, db) {
        var result = new Object({status: "ok"});
        if (err === null) {
            //console.log("connect to mongo");
            var profiles = db.collection("profiles");
            profiles.findOne({name:name}, function(err,data){
                if(err != null) {
                    result.status = "error";
                    result.error = err;
                }
                else {
                    result.data = data;
                }
                db.close();
                callback(result);
            });
        }
        else {
            result.status = "error";
            result.error = err;
            console.err("Profile.findByEmail connect error:", err);
            db.close();
            callback(result);
        }
    });
};

exports.upsertProfile = function(profile, callback){
    MongoClient.connect(url, function (err, db) {
        var result = new Object({status: "ok"});
        if (err === null) {
            //console.log("connect to mongo");
            var profiles = db.collection("profiles");
            profiles.update({email: profile.email}
                , profile, {upsert:true}
                , function(err,data){
                    if(err != null) {
                        result.status = "error";
                        result.error = err;
                    }
                    db.close();
                    callback(result);
                });
        }
        else {
            result.status = "error";
            result.error = err;
            console.err("Profile.upsert connect error:", err);
            db.close();
            callback(result);
        }
    });
};

exports.update = function(profile, callback) {
    MongoClient.connect(url, function (err, db) {
        var result = new Object({status: "ok"});
        if (err === null) {
            //console.log("connect to mongo");
            var profiles = db.collection("profiles");
            profiles.update({email:profile.email}
                , profile
                , function(err,data){
                    if(err != null) {
                        result.status = "error";
                        result.error = err;
                    }
                    db.close();
                    callback(result);
                });
        }
        else {
            result.status = "error";
            result.error = err;
            console.err("Profile.update connect error:", err);
            db.close();
            callback(result);
        }
    });
};


exports.updateAuthToken = function(email, authToken, callback) {
    MongoClient.connect(url, function (err, db) {
        var result = new Object({status: "ok"});
        if (err === null) {
            //console.log("connect to mongo");
            var profiles = db.collection("profiles");
            profiles.update({email:email}
                , {$set:{authToken:authToken}}
                , function(err,data){
                    if(err != null) {
                        result.status = "error";
                        result.error = err;
                    }
                    db.close();
                    callback(result);
                });
        }
        else {
            result.status = "error";
            result.error = err;
            console.err("Profile.updateAuthToken connect error:", err);
            db.close();
            callback(result);
        }
    });
};

exports.updateGcmId = function(email, gcmId, callback) {
    MongoClient.connect(url, function (err, db) {
        var result = new Object({status: "ok"});
        if (err === null) {
            //console.log("connect to mongo");
            var profiles = db.collection("profiles");
            profiles.update({email:email}
                , {$set:{gcmId:gcmId}}
                , function(err,data){
                    if(err != null) {
                        result.status = "error";
                        result.error = err;
                    }
                    db.close();
                    callback(result);
                });
        }
        else {
            result.status = "error";
            result.error = err;
            console.err("Profile.updateAuthToken connect error:", err);
            db.close();
            callback(result);
        }
    });
};

