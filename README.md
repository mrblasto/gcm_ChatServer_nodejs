# gcm_ChatServer_nodejs
## Description
gcm_ChatServer_nodejs is a web service that implements a chat server using Google Cloud Messaging, node-gcm, express, and mongodb.  For a complete list of depedencies see package.json.  Stay tuned for an upload of an Android Client to use this sever.

## Installation and setup
To install code, clone or download then run `npm install` to install the dependencies.

To use you need to replace the id on line 16 of index.js with your public Google API access key.  See http://developer.android.com/google/gcm/gs.html for more information on obtaining an API access key as well as information on building a client and obtaining a registration token as well as building your own server in Java or PHP.

You'll also need access to a mongodb server. Change line 11 of data/profile.js to a connection string specific to your database.  The connection string there now is the default. See https://www.mongodb.org/ for more information about mongodb.  Note that the database and tables are created the first time the database is used.  This is a feature of mongodb.

## Running and Using
Open a command prompt and browse to where you've downloaded gcm_ChatServer_nodejs and run `node .` to start the server.  Open a second command prompt (doesn't matter where) and start mongodb: `mongod`.

There are two steps to sending a message.  All clients must call first call register as an http post with a url of `*hostname*:3000/register' with parameters ( example: `http://localhost:3000/register` ):

Parameter Name | Parameter Value
---------------|-----------------
regid          | registration token obtained by client from Google Play Services(Required)
email          | email of a Google Play Account to which registration applies (Required)
name           | name used to identify client for sending messages to it (Required)
authToken      | authentication token obtained from OAuth.  Not used in this version (Optional)
avatar         | url locating image associated with client.  Not used in this version (Optional)

After successful registration the client can send an http post with a url of `*hostname*:3000/chat` with parameters

Parameter Name | Parameter Value
---------------|-----------------
to             | Name of client to send chat message to
message        | Text of the message

The response from either web service endpoint will be a JSON string of the form:

`{status:'ok'}`

or

`{status:'error', error:*information about error*}`

You can change what port the server listens to on line 161 of index.js
