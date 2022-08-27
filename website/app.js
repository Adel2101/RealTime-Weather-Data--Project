/* Global Variables */
const baseURL = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&zip=';
const apiKey = '&appid=7d68436b5f63ed24ad36cdd0736a94ea&units=imperial';
const generateButton = document.getElementById('generate'); //DOM element of the Generate Button
const city = document.getElementById('city'); //DOM element of the city
const country = document.getElementById('country'); //DOM element of the country
const date = document.getElementById('date'); //DOM element of the date
const temp = document.getElementById('temp'); //DOM element of the temp
const feeling = document.getElementById('feeling'); //DOM element of the user input regarding the feeling
const wrongEntryElement = document.getElementById('wrongEntry'); //DOM element of the error msg when a wrong ZIP code is entered

// Create a new date instance dynamically with JS
//let d = new Date();
//let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

generateButton.addEventListener('click',generateFunction); //function to be implemented upon clicking onthe button.

function generateFunction ()
{
    const zipCode = document.getElementById('zip').value; //get the entered value of the ZIP Code
    const feelingToday = document.getElementById('feelings').value; //get the entered value of user feeling
    console.log("button is clicked");
    getWeather(zipCode).then(function(newData) //implement the getWeather first succesfullythen start processing the data.
    {
        if(newData != null) //this condition is to ensure that there are data received,if a wrong ZIP is enetered,the newData will be empty
        {
            //arrange the data that will be posted to the server
            dataToBePosted = {
                city : newData.city.name,
                country : newData.city.country,
                temp : newData.list[0].main.temp,
                date : newData.list[0].dt_txt,
                feeling : feelingToday
            }
            postData('/add',dataToBePosted); //Post Request to the server
            uiUpdate('/get'); //update the User Interface with the data from the server
        }
        else
        {
            console.log("postData to the server isn't implemented due to an error in the API fetch");

        }

    });

    
}
//function used to get the weather data from the Weather API
const getWeather = async (zipCode)=> 
    {
        const response = await fetch(baseURL+zipCode+apiKey);
        console.log(response);

        if(response.status == 404) //check if the status is 404 (wrong ZIP code)
        {
            console.log("Zip Code Error: "+response.statusText);
            wrongEntryElement.style.display = "block"; //if wrong ZIP,show the error msg in the page 

        }
        else if(response.status == 200) //check if the status is ok
        {
            wrongEntryElement.style.display = "none"; //if correct ZIP,hide the wrong ZIP error msg from the page 
            try {
                const newData = await response.json();
                console.log(newData);
                return newData; //return the data received from the weather API
            }
            catch (error) {
                console.log("error", error);
            }
        }
    }

//Function used to post the data received from the weather website to the server
const postData = async (url='',data={})=>{

    const response = await fetch(url ,{ 
        method:'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(data)
    });
      try{
        responseReceived = response.json();
        console.log("Post Request is done and the projectData variable now is:");
        console.log(responseReceived);
      }
      catch(error)
      {
        console.log("error is: "+error);
      }
}

//function to fetch data from the server and update the DOM Elements
const uiUpdate = async (url='')=>{

    const response = await fetch(url);
    try{
        dataReceivedFromServer = await response.json();
        console.log(dataReceivedFromServer);
        const length = dataReceivedFromServer.length; //get the length of the data received in order to know the number of the last entry
        //update all the DOM Elements for User Interface with the data received from the server
        city.innerHTML = "City: "+dataReceivedFromServer[length-1].city;
        country.innerHTML = "Country: "+dataReceivedFromServer[length-1].country;
        date.innerHTML = "Date: "+dataReceivedFromServer[length-1].date;
        temp.innerHTML = "Temp: "+dataReceivedFromServer[length-1].temp;
        feeling.innerHTML = "Feeling: "+dataReceivedFromServer[length-1].feeling;
    }
    catch(error)
    {
        console.log("error is: "+error);
    }
}