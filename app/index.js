/*
 * Entry point for the watch app
 */
import document from "document";
// Import the HeartRate module
import { me } from "appbit";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";
import { today } from "user-activity";
import getBusStopTimes from "../companion/index.js"
import document from "document";
import messaging from "messaging";
import { geolocation } from "geolocation";

let centralTextArea = document.getElementById('centralTextArea');
let customTextArea = document.getElementById('custom-text-area');
let bottomLeftButton = document.getElementById('bottomLeftButton');
let bottomRightButton = document.getElementById('bottomRightButton');
let topRightButton = document.getElementById('topRightButton');
let topLeftButton = document.getElementById('topLeftButton');

centralTextArea.text ="";

function buttonController(event) {

}


messaging.peerSocket.onopen = function() {
  bottomRightButton.addEventListener("activate", (event) => {
    if (centralTextArea.text === '') {
      switch (bottomRightButton.text) {
        case 'Weather' :
         requestWeather();
          break;
        case 'Bus Tracker' :
          requestBusSchedule();
          break;
        case 'None' :
          break;
        default:
          console.log("Ain't gonna be here");
      }
    } else {
      centralTextArea.text = '';
    }
  });
  bottomLeftButton.addEventListener( "activate", (event) => {
    if (centralTextArea.text === '') {
       switch (bottomLeftButton.text) {
        case 'Weather' :
         requestWeather();
          break;
        case 'Bus Tracker' :
          requestBusSchedule();
          break;
        case 'None' :
          break;
        default:
          console.log("Ain't gonna be here");
       }
    } else {
      centralTextArea.text = '';
    }
  });
  topRightButton.addEventListener( "activate", (event) => {
    console.log("toprightbutton fired");
    if (centralTextArea.text === '') {
       switch (topRightButton.text) {
        case 'Weather' :
         requestWeather();
          break;
        case 'Bus Tracker' :
          requestBusSchedule();
          break;
        case 'None' :
          break;
        default:
          console.log("Ain't gonna be here");
       }
    } else {
      centralTextArea.text = '';
    }
  });
  topLeftButton.addEventListener( "activate", (event) => {
        console.log("topleftbutton fired");

    if (centralTextArea.text === '') {
       switch (topLeftButton.text) {
        case 'Weather' :
         requestWeather();
          break;
        case 'Bus Tracker' :
          requestBusSchedule();
          break;
        case 'None' :
          break;
        default:
          console.log("Ain't gonna be here");
       }
    } else {
      centralTextArea.text = '';
    }
  });
};

messaging.peerSocket.onmessage = (event) => {
  switch(event.data.title) {
    case 'replyBusSchedule':
      console.log('Fire bus');
      if (centralTextArea.text === "") {
        console.log("empty")
        for (var bus in event.data.body) {
          centralTextArea.text += event.data.body[bus].routeNo + ": " + event.data.body[bus].time + "\n";
        }
      } else {
        centralTextArea.text === '';
      }
      break;
    case 'replyWeather':
      console.log('Fire weather');
      let currentWeather = event.data.current;
      let hourly = event.data.hourly;   // hourly returns an array of objects with icon, temperature, and hour properties
      if (centralTextArea.text === "") {
        centralTextArea.text = JSON.stringify(event.data.current) + "\u00B0" + "C";
      } else {
        centralTextArea.text === '';
      }
      break;
    case 'replyBusScheduleError':
      let error = event.data.error;
      centralTextArea.text = error;
      break;
    case 'topLeft':
      let addon = event.data.body[0].name;
      topLeftButton.text = addon;
      break;
    case 'topRight':
     let addon = event.data.body[0].name;
      topRightButton.text = addon;      
      break;
    case 'bottomLeft':
     let addon = event.data.body[0].name;
      bottomLeftButton.text = addon;
      break;
    case 'bottomRight':
       let addon = event.data.body[0].name;
        bottomRightButton.text = addon;
      break;
    default:
      console.log("Never should reach here");
  }
};



let hrm = new HeartRateSensor();

let userHR = document.getElementById('userHR');

// Begin monitoring the sensor
hrm.start();

//initializing text 
userHR.text = "HR: --";

hrm.onreading = function() {  
  userHR.text = "HR: " + hrm.heartRate; // sets the text to the heartRate
}

let myClock = document.getElementById('myClock');
myClock.layer = 2;
clock.granularity = "seconds"; // seconds, minutes, hours

clock.ontick = function(evt) {
    myClock.text = ("0" + evt.date.getHours()).slice(-2) + ":" +
    ("0" + evt.date.getMinutes()).slice(-2) + ":" +
    ("0" + evt.date.getSeconds()).slice(-2);
 
};

let userSteps = document.getElementById('userSteps');
userSteps.text = "Steps: " + (today.local.steps || 0);

let userCalories = document.getElementById('userCalories');
userCalories.text = "Calories: " + (today.local.calories || 0);

let userDistance = document.getElementById('userDistance');
userDistance.text = "Distance: " + ( (today.local.distance/1000) || 0) + "km";

let userActivity = document.getElementById('userActivity');
userActivity.text = "Activity: " + ( (today.local.activeMinutes) || 0);


function requestWeather() {
  geolocation.getCurrentPosition( (position) => {
  let data = {
    title: "requestWeather",
    lat: position.coords.latitude.toFixed(6),
    long: position.coords.longitude.toFixed(6)
  }
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.log('dddddddddddata', data)
    messaging.peerSocket.send(data);
  } 
  })
}

function requestBusSchedule() {
  geolocation.getCurrentPosition( (position) => {
    let data = {
      title: "requestBusSchedule",
      lat: position.coords.latitude.toFixed(6),
      long: position.coords.longitude.toFixed(6)
    }
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);
    }   
  }); 
}

function toggleElement(element) {
  element.style.display = (element.style.display === "inline") ? "none" : "inline";
}
