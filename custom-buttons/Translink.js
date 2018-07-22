import * as messaging from 'messaging';

var TRANSLINK_TOKEN = 'vKA3raaVZjr4hO3XzyyN';
var options = {
      headers: {
          "content-type": "application/JSON",
          "accept": "application/JSON",
      }
  };

export default function getBusStopTimes(lat, long) {
    getBusStopWithLatLong(lat, long)
    .then( (result) => {
      if (result.error) {
        
        let data = {
            title: "replyBusScheduleError",
            body: result,
          };
          if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
          }
        
        
      } else {
         getBusStopEstimate(result)
          .then( (result) => {
          let data = {
            title: "replyBusSchedule",
            body: result,
          };
          if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
          }

        
      });
      }
    });
}

function getBusStopWithLatLong(lat, long) {
  let url = "https://api.translink.ca/rttiapi/v1/stops?";
  url += "apikey=" + TRANSLINK_TOKEN;
  url += "&lat=" + lat;
  url += "&long=" + long;
 
  var options = {
        headers: {
            "content-type": "application/JSON",
            "accept": "application/JSON",
        }
    };

  return new Promise((resolve, reject) => {
     fetch(url, options).then(function(response) {
      return response.json();
    }).then( (json) => {

       if (json[0].StopNo) { 
          resolve(json[0].StopNo);
       } else {
          error: "No bus stops in your area."
       }
    })
  })
}
 

function getBusStopEstimate(busStopNumber) {

 let url = "http://api.translink.ca/rttiapi/v1/stops/";
 url += busStopNumber + '/estimates?';
 url += "apikey=" + TRANSLINK_TOKEN;
 url += "&count=1";

 return new Promise( (resolve, reject) => {
   fetch(url, options).then(function(response) {
      return response.json();
    }).then( (response) => {
      var routeNumbers = response.map( a => a.RouteNo);
      var expectedLeaveTime = response.map( a => a.Schedules[0].ExpectedLeaveTime);
      let nextRouteTimes = [];

      for (let i = 0; i < routeNumbers.length; i++) {
        nextRouteTimes.push({
          routeNo: routeNumbers[i],
          time: expectedLeaveTime[i],
        });
      }
      resolve(nextRouteTimes); 
   })
 });

}