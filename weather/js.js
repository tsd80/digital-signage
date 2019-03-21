
fetch('http://weather.tsyganok.net/')
.then(function(resp) { return resp.json() }) // Convert data to json
    .then(res=> renderData(res))
    .catch((error)=> console.log(error));



const renderData = (inData) => {
  let info ={}; info.tomorrow={}; info.today={};
  let tommorowDay = new Date();

  for (let name in inData) {
    if (name==="mts-1-1-Temperature" || name==="mts-1-1-WindSpeedMS" || name==="mts-1-1-WeatherSymbol3") {
      info.today[name]=inData[name][0].value;
      for (let dataPair of inData[name]) {
        let date = new Date(dataPair.time);
        tommorowDay.setDate(tommorowDay.getDate() + 1);
        tommorowDay.setHours(12);
        tommorowDay.setMinutes(0);
        tommorowDay.setSeconds(0);
        tommorowDay.setMilliseconds(0);
        if (tommorowDay.getHours()===date.getHours()) {
          info.tomorrow[name] = dataPair.value;
        }
      }
    }
  }
  drawWeather(info);
};




function drawWeather( d ) {
  console.log(d);
  let celcius = Math.ceil(d.today["mts-1-1-Temperature"]);
  let celcius2 = Math.ceil(d.tomorrow["mts-1-1-Temperature"]);

  let wind = d.today["mts-1-1-WindSpeedMS"];
  let wind2 = d.tomorrow["mts-1-1-WindSpeedMS"];

  let icon = d.today["mts-1-1-WeatherSymbol3"];
  let icon2 = d.tomorrow["mts-1-1-WeatherSymbol3"];

  let iconurl = "./icons/" + icon + ".0.svg";
  let iconurl2 = "./icons/" + icon2 + ".0.svg";

  document.getElementById('wind').innerHTML = 'Tuulen nopeus '+wind+' m/s';
  document.getElementById('img').innerHTML = '<img height="175" width="150" src="' + iconurl  + ' " >';
  document.getElementById('temp').innerHTML = celcius + '&deg';

  document.getElementById('wind2').innerHTML = 'Tuulen nopeus '+wind2+' m/s';
  document.getElementById('img2').innerHTML = '<img height="175" width="150" src="' + iconurl2  + ' " >';
  document.getElementById('temp2').innerHTML = celcius + '&deg';
}


  //console.log(celcius);
  //let wind = d.list[1].weather[0].description;
  //let img=d.list[1].weather[0].icon;
 // let imgurl = "./icons/" + img + ".svg";

// document.getElementById('wind').innerHTML = description;
  //document.getElementById('img').innerHTML = '<img height="100" width="75" src="' + imgurl + ' " >' + '<br>';
  //document.getElementById('temp').innerHTML = celcius + '&deg';


  //let celcius2 = Math.round(parseFloat(d.list[1].main.temp)-273.15);
  //let description2 = d.list[1].weather[0].description;
  //let img2=d.list[1].weather[0].icon;
 // let imgurl2 = "./icons/" + img2 + ".svg";

  //document.getElementById('description2').innerHTML = description2;
  //document.getElementById('img2').innerHTML = '<img height="100" width="75" src="' + imgurl + ' " >' + '<br>';
  //document.getElementById('temp2').innerHTML = celcius + '&deg;';

  //let celcius3 = Math.round(parseFloat(d.list[1].main.temp)-273.15);
  //let description3 = d.list[1].weather[0].description;
  //let img3=d.list[1].weather[0].icon;

  //let imgurl3 = "./icons/" + img3 + ".svg";

  //document.getElementById('wind3').innerHTML = description3;
  //document.getElementById('img3').innerHTML = '<img height="100" width="75" src="' + imgurl + ' " >' + '<br>';
  //document.getElementById('temp3').innerHTML = celcius + '&deg;';













//let xhttp = new XMLHttpRequest();
//xhttp.onreadystatechange = function() {
  //if (this.readyState === 4 && this.status === 200) {
    // Typical action to be performed when the document is ready:
    //document.getElementById('weather').innerHTML = xhttp.responseText;
    //myFunction(this);
  //}
//};

//xhttp.open("GET","http://data.fmi.fi/fmi-apikey/53036c5e-e84a-4fae-8c78-a279be5b281e/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::timevaluepair&parameters=Temperature,Pressure,Humidity,WindDirection,WindSpeedMS,MaximumWind,WindGust,DewPoint,TotalCloudCover,WeatherSymbol3,Precipitation1h,PrecipitationAmount&latlon=60.2586351,24.8439799&timezone=Europe/Helsinki", true);
//xhttp.send();

//function myFunction(xml) {
  //let xmlDoc = xml.responseXML;
  //let x = xmlDoc.getElementsByTagName('wml2:MeasurementTimeseries')[0].childNodes[1].childNodes[1].childNodes[3].textContent;
  //let y = xmlDoc.getElementsByTagName('wml2:MeasurementTimeseries')[9].childNodes[1].childNodes[1].childNodes[3].textContent;
  //let z = xmlDoc.getElementsByTagName('wml2:MeasurementTimeseries')[5].childNodes[1].childNodes[1].childNodes[3].textContent;

 // let url=Math.trunc(y);
  //let img_url = "./icons/" + url + ".svg";

  //document.getElementById("temp").innerHTML = x+'&deg';
  //document.getElementById("wind").innerHTML = 'Tuulen nopeus '+z+' m/s';
  //document.getElementById("img").innerHTML = '<img height="120" width="100" src="' + img_url + '" >';
  //document.getElementById("temp3").innerHTML = z;
//}



//string json = JsonConvert.SerializeXmlNode('weather');

