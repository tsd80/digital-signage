let xmlo = new XMLHttpRequest();

xmlo.onreadystatechange = function() {
    if (xmlo.readyState === 4 && xmlo.status === 200) {

        let x = xmlo.responseXML.getElementsByTagName("wml2:MeasurementTimeseries")[0];

        console.log(x);
        //document.getElementById("result").innerHTML = xml.responseText;
    }
};
xmlo.open("GET", "http://data.fmi.fi/fmi-apikey/53036c5e-e84a-4fae-8c78-a279be5b281e/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::timevaluepair&parameters=Temperature,Pressure,Humidity,WindDirection,WindSpeedMS,WindGust,DewPoint,TotalCloudCover,WeatherSymbol3,Precipitation1h,PrecipitationAmount&latlon=60.2586351,24.8439799&timezone=Europe/Helsinki", true);
xmlo.send();

// Changes XML to JSON
function xmlToJson(xml) {

    // Create the return object
    let obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for(let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};