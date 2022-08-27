// Setup empty JS object to act as endpoint for all routes
const projectData = [];

// Require Express to run server and routes
const express = require("express");


// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8000;
const server = app.listen(port,function(){
    console.log("server is running at local host: "+port)
});

//Setup the GET Route
app.get('/get',getProjectData);
function getProjectData(request,response)
{
    //send the server data to the client and print the success message
    response.send(projectData)
    console.log("getProjectData request is implemented and projectData is sent to client")
}

//Setup the POST Route
app.post('/add',postProjectData);
function postProjectData(request,response)
{
    //process the data received and push it to the projectData
    dataReceived = {
        city : request.body.city,
        country : request.body.country,
        temp : request.body.temp,
        date : request.body.date,
        feeling: request.body.feeling}
    projectData.push(dataReceived);
    console.log("postProjectData request is implemented and projectData Variable becomes:");
    console.log(projectData);
    response.send(projectData);
}