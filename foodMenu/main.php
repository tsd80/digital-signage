<?php

$uriSegments = explode("/", parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
//echo $uriSegments[1]; //returns "codex" http://www.example.com/codex/foo/bar

$schools = array(
  "arabia" => 16364,
  "myyrmaki" => 16365,
  "myllypuro" => 35449,
  "huopalahti" => 16448,
  "" => 16365,
);

$url = "https://www.sodexo.fi/ruokalistat/output/daily_json/".$schools[end($uriSegments)]."/".date("Y")."/".date("m")."/".date("d")."/fi";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch);
curl_close($ch);

//$obj = json_decode($result);


include "index.php";