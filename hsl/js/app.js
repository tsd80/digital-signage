'use strict';
lat             = lat             || 60.1707334;  // Latitude position, default center of Helsinki
lon             = lon             || 24.9414158;  // Longitude position, default center of Helsinki
radius          = radius          || 1100;        // Radius in meters of walking distance
numPerStop      = numPerStop      || 20;          // Number of lines to grab per stop
speedWalk       = speedWalk       || 1.4;         // Walking speed in m/s
blinkThreshold  = blinkThreshold  || 0;           // if >0, then amount of time  in mins to blink before the arrival
reloadTime      = reloadTime      || 30;          // Amount of seconds to reload information
pathTo          = pathTo          || "../";

const loadPage = () => {

  const url = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";
  const data = `
{
  stopsByRadius(lat: ${lat}, lon: ${lon}, radius: ${radius}) {
    edges {
      node {
        distance
        stop {
          platformCode
          vehicleMode
          name
          stoptimesWithoutPatterns(numberOfDepartures: ${numPerStop}, omitNonPickups: true) {
            serviceDay
            scheduledArrival
            realtimeArrival
            arrivalDelay
            realtime
            realtimeState
            trip {
              wheelchairAccessible
              gtfsId
              tripHeadsign
              routeShortName
              alerts {
                alertUrl
                alertHeaderText
                alertDescriptionText
              }
            }
          }
        }
      }
    }
  }
}
`;

  fetch(url, {
    method: 'POST',
    headers: {"Content-Type": "application/graphql"},
    body: data
  }).
      then(res => res.json()).
      then(res => renderData(res.data)).
      catch(error => console.log(error));
};


const renderData = (inData) => {
  let lines = [];
  for(let ex in inData.stopsByRadius.edges) {
    let busStop = inData.stopsByRadius.edges[ex].node;
    let distance = busStop.distance;
    let vehicle = busStop.stop.vehicleMode;
    let name = busStop.stop.name;
    let platform = busStop.stop.platformCode;
    for (let stwp in busStop.stop.stoptimesWithoutPatterns) {
      let oneLine = [];
      let today = new Date();
      let arrival = busStop.stop.stoptimesWithoutPatterns[stwp];
      oneLine.scheduleArrival = new Date((arrival.serviceDay+arrival.scheduledArrival)*1000);
      oneLine.realtimeArrival = new Date((arrival.serviceDay+arrival.realtimeArrival)*1000);
      oneLine.scheduleHour = oneLine.scheduleArrival.getHours();
      oneLine.scheduleMinute = oneLine.scheduleArrival.getMinutes();
      oneLine.realHour = oneLine.realtimeArrival.getHours();
      oneLine.realMinute = oneLine.realtimeArrival.getMinutes();
      oneLine.delay = arrival.arrivalDelay;
      oneLine.realtime = arrival.realtime;
      oneLine.realState = arrival.realtimeState;
      oneLine.wheelC = arrival.trip.wheelchairAccessible === 'POSSIBLE';
      oneLine.id = arrival.trip.gtfsId;
      oneLine.number = arrival.trip.routeShortName;
      oneLine.heading = arrival.trip.tripHeadsign;
      oneLine.alert1 = arrival.trip.alerts.alertUrl;
      oneLine.alert2 = arrival.trip.alerts.alertHeaderText;
      oneLine.alert3 = arrival.trip.alerts.alertDescriptionText;
      oneLine.distance = distance;
      oneLine.vehicle = vehicle;
      oneLine.name = name;
      oneLine.platform = platform;
      oneLine.walkingTime = oneLine.distance/speedWalk*1000;
      oneLine.timeUntil = (oneLine.realtimeArrival-oneLine.walkingTime-today)/60000;

      if (lines.findIndex(x => x.id === oneLine.id)>=0) {break;} //same line, brake the loop
      if (oneLine.timeUntil<0) {break;} //you will not make it on time to the bus stop, break the loop (NB: real time!)
      lines.push(oneLine);
    }
  }
  lines.sort((a, b) => a.scheduleArrival - b.scheduleArrival);
  showData(lines);
};

const showData = (inData) => {
  //displayLog(inData);
  const show = document.getElementById('result');
  show.innerHTML ='<div class="row header bborder" id="header"><div class="timeTop center">Aika</div><div class="number center">Linja</div><div class="heading ccenter">Määränpää</div><div class="stopName">Pysäkki</div><div class="walking center">Kävelyaika</div></div>';

  //Displaying and removing dump div to measure its heights.
  show.innerHTML +=`<div class='timetable hidden' id='first'><div class='row'><div class='time'>00:00</div><div class="number">99</div><div class="heading"><img src="${pathTo}assets/train.png" alt="train">XXX</div><div class="stopName">XXX</div><div class="walking">XXX</div></div></div>`;
  let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  inData.length = Math.floor(( windowHeight - document.getElementById('header').clientHeight - 7) / document.getElementById('first').clientHeight);

  /*
  console.log(`Height: ${windowHeight} Header: ${document.getElementById('header').clientHeight} One: ${document.getElementById('first').clientHeight} Length: ${inData.length}
   Without -7 it is ${(windowHeight - document.getElementById('header').clientHeight) / document.getElementById('first').clientHeight}
   with -7 it is ${(windowHeight - document.getElementById('header').clientHeight-7) / document.getElementById('first').clientHeight}`);
  */
  show.removeChild(show.childNodes[1]);

  let showThat ="<div class='timetable'>";
  for(let line in inData) {
    let real="", blink="", showTxt = "", late, hide;
    let row = inData[line];

    if (row.scheduleMinute<10) {row.scheduleMinute = "0"+row.scheduleMinute.toString()}
    if (row.scheduleHour<10) {row.scheduleHour = "0"+row.scheduleHour.toString()}
    if (row.realMinute<10) {row.realMinute = "0"+row.realMinute.toString()}
    if (row.realHour<10) {row.realHour = "0"+row.realHour.toString()}

    let scheduleTime = row.scheduleHour+":"+row.scheduleMinute;
    let realTime = row.realHour+":"+row.realMinute;

    if (row.vehicle==="RAIL") {row.name = `<img src="${pathTo}assets/train.png" alt="train">${row.name}`;}
    if (row.vehicle==="TRAM") {row.name = `<img src="${pathTo}assets/tram.png" alt="tram">${row.name}`;}
    if (row.vehicle==="SUBWAY") {row.name = `<img src="${pathTo}assets/metro.png" alt="metro">${row.name}`;row.wheelC=true;}
    if (row.platform && row.vehicle!=="TRAM") {row.name += ` / ${row.platform}`;}

    if (row.delay>60) {late=` | </span><span class="late">${realTime}</span>`;hide="hide";}
    else if (row.delay<-30) {late=` | </span><span class="early">${realTime}</span>`;hide="hide";}
    else {late="</span>";hide="";}
    real = row.realtime?"online":"offline";

    if (blinkThreshold) {if (row.timeUntil<blinkThreshold) {blink ="soon";}}

    showTxt += `<div class='row bborder ${blink}'>`;

    showTxt += `<div class="time"><i class="material-icons ${real}">rss_feed</i><span class="${hide}">${scheduleTime}${late}</div>`;
    showTxt += `<div class="number center">${row.number}</div>`;
    showTxt += `<div class="heading">${row.heading}</div>`;
    showTxt += `<div class="stopName">${row.name}</div>`;
    showTxt += `<div class="walking center">${Math.ceil(row.walkingTime/60000)} min</div>`;

    showTxt +="</div>";
    showThat+=showTxt;

  }

  showThat +="</div>";
  show.innerHTML += showThat;
};

const displayLog = (inData) => {
  for(let line in inData) {
    let x = inData[line];
    if (x.vehicle==="SUBWAY") {
      console.log(x.realtime, x.number, x.heading, x.name, x.timeUntil, x.realState, x.id, x.walkingTime);
    }
  }
};

loadPage();

let reloadTimeTable =  setInterval(loadPage, reloadTime*1000);
