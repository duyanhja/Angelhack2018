import { geolocation } from 'geolocation';
import Translink from '../custom-buttons/Translink';
import Weather from '../custom-buttons/Weather';
import { settingsStorage } from "settings";
import * as messaging from 'messaging';

messaging.peerSocket.onmessage = (event) => {
  
  switch(event.data.title) {
    case 'requestBusSchedule':
      let { lat, long } = event.data;
      Translink(lat, long);
      break;
    case 'requestWeather':
      let { lat, long } = event.data;
      Weather(lat, long);
      break;
    default:
      console.log("Never should reach here");
  }
  
};

settingsStorage.addEventListener("change", evt => {

  
  if (evt.oldValue !== evt.newValue) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(whichButtonLocation(evt));
    } else {
      console.log("No peerSocket connection");
    }
    }
});

function whichButtonLocation(evt) {

  console.log(JSON.stringify(evt.key, null, 3));
  let data = {
    title: evt.key,
    body: JSON.parse(evt.newValue).values
  }

  console.log(data);
  return data;
  
} 