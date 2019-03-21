<?php
/**
 * Created by PhpStorm.
 * User: Edvard
 * Date: 14.03.2019
 * Time: 15:23
 */
$url = "http://data.fmi.fi/fmi-apikey/(put api key here)/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::timevaluepair&parameters=Temperature,Pressure,Humidity,WindDirection,WindSpeedMS,WindGust,DewPoint,TotalCloudCover,WeatherSymbol3,Precipitation1h,PrecipitationAmount&latlon=(your location here)&timezone=Europe/Helsinki";
$ch = curl_init();
$timeout = 5;
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
$data = curl_exec($ch);
curl_close($ch);

function parseXml($payload)
{
    $json_return = [];
    $_payloadXML = new SimpleXMLElement($payload);
    if(is_object($_payloadXML)){
        $namespaces = $_payloadXML->getDocNamespaces();
        $result = $_payloadXML->children($namespaces['wfs']);

    for($i=0; $i<$result->count();$i++)
    {
        $y = $result[$i]
            ->children($namespaces['omso'])
            ->children($namespaces['om'])
            ->result
            ->children($namespaces['wml2'])
            ->MeasurementTimeseries;
        $measureType = $y
            ->attributes($namespaces['gml'])
            ->id;
        $json_return[strval($measureType)] = [];
        for($j=0;$j<$y->point->count();$j++)
        {
            $paramPair = [];
            $paramPair["time"] = $y->point[$j]->MeasurementTVP->time;
            $paramPair["value"] = $y->point[$j]->MeasurementTVP->value;
            array_push($json_return[strval($measureType)],$paramPair);
        }
    }
        return $json_return;
    } else {
      return 'Error';
    };
}

include "index.php";
