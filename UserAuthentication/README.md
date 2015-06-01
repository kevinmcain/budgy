# Budgy-User Authentication via mongo session (Inorder to create three users to have different data for each user as mentioned by the professor)
Persistant Sessions management using connect-mongo.  This sample stored the session data on the same mongo connection you create for your data.

Pre-requisite to run this app:
* Type these commands in your interactive mongo client window to create the admin account for your mongo DB:

use admin

db.createUser({user: "dbAdmin", pwd: "test", roles: [ "readWriteAnyDatabase", "dbAdminAnyDatabase", "clusterAdmin"]})
show collections
db.users.find()


* You need to run my mongo script to pre-populate the data and create user accounts: "mongoScript.user.js"
* You will need to modify the "db.budgy.config" file with your db information.

To run this sample do the following:
* Initialize the pre-requisite modules by running "npm install"
* Run sample app using the following command "node server.js"

Test the sample app by going to a browser and accessing the following URLs:
* http://localhost:8080/
* Login with one of the following user accounts: sravani, ishwant, or Kevin
* Password can be anything.

Note: UserAuthentication folder contains only the files (or data in files) related to the user login via mongoSession having three users.
When you enter the correct username it will display the 'OK' message else it will show you the 'Not found' message.

Kevin you can go ahead and integrate with the rest of the App. And i'm unable to hide the nav-bar in the login page. Any one can look into it.
