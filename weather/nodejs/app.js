'use strict';


const http = require('http');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const parseXML = (result) => {
  let json = {};
  result = result["wfs:FeatureCollection"]["wfs:member"];
  for (let i=0;i<result.length;i++) {
    let y = result[i]
        ["omso:PointTimeSeriesObservation"][0]
        ["om:result"][0]
        ["wml2:MeasurementTimeseries"][0];
    let measureType = y["$"]["gml:id"];
    json[measureType]=[];
    for (let j=0;j<y["wml2:point"].length;j++) {
      let paramPair = {};
      paramPair["time"] = y["wml2:point"][j]["wml2:MeasurementTVP"][0]["wml2:time"][0];
      paramPair["value"] = +y["wml2:point"][j]["wml2:MeasurementTVP"][0]["wml2:value"][0];
      json[measureType].push(paramPair);
    }
  }
  return json;
};

const parseJSON = (inData) => {
  /*Object.keys(inData).map(function(objectKey, index) {
    let value = inData[objectKey];
    console.log(value);
  });*/

  return inData;
};

http.get("http://data.fmi.fi/fmi-apikey/YOURAPIKEYHERE/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::timevaluepair&parameters=Temperature,Pressure,Humidity,WindDirection,WindSpeedMS,WindGust,DewPoint,TotalCloudCover,WeatherSymbol3,Precipitation1h,PrecipitationAmount&latlon=60.2586351,24.8439799&timezone=Europe/Helsinki", function(res) {
  let data = '';
  res.on('data', function(stream) {
    data += stream;
  });
  res.on('end', function(){
    parser.parseString(data, function(error, result) {
      let fromXML = parseXML(result);
      let json = parseJSON(fromXML);

      if(error === null) {
        http.createServer(function(req,res){

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify(json));
        }).listen(process.env.PORT);
      }
      else {
        console.log(error);
      }
    });
  });
});