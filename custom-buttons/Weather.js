import * as messaging from 'messaging';

export default function getWeather(lat, long) {

  let date = new Date();
  let url = "https://api.darksky.net/forecast/4839bc8c50395f7af9bde7342785f021/"
  url += lat + ",";
  url += long + "?";
  url += "units=auto";

  fetch(url)
  .then( (response) => {return response.json()})
  .then( (response) => {

    let biHourlyWeather = [];

    for (let i = 0; i < 8; i++) {
      biHourlyWeather.push({
        icon: response.hourly.data[i].icon,
        temperature: response.hourly.data[i].apparentTemperature,
        hour: timeAmPm(date.getHours() + i)
      });
    }

    let data = {
      title: "replyWeather",
      current: response.currently.temperature,
      hourly: biHourlyWeather,
    }

    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);
    }

  });
 
}

function timeAmPm(hour) {

 if (hour > 13) {
   return hour - 12 
 } else {
   return hour;
 }

}