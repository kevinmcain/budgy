#BUDGY 
Facebook authentication sample

In this repository, you will find the code to  authenticate the user of your web app using Facebook Authentication.

Some pre-requisites:
* You'll need to login to your facebook account and go to the developer area: https://developers.facebook.com/ 
* There you will need to define an application for your app, remember to enter your email address to config your app.
* Next, you will need to use the Apps: App ID and App Secret information to enable the authentication

	Above steps are already done and places App ID and App secret info in app.js file.

* Open the App.js file and replace the dummy variables with the real values.
* Remeber to use the localtest.me hostname to create a callback to your localhost:3000, something like "me.localtest.me:3000"

To run this sample do the following:
* Initialize the pre-requisite modules by running "npm install"
* Run sample app using the following command "node app.js"

Test the sample app by going to a browser and accessing the following URLs:
* http://localhost:3000/
* http://localhost:3000/account
* http://localhost:3000/layout
