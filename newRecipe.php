<?php

//  Load object from string
$jobj = json_decode(file_get_contents('php://input'));

//  Load file data into object
$file = json_decode(file_get_contents('data/mealplan.json'));

//  Add new recipe at given index
//  New array members to be added must be provided in a container array
//  Otherwise their properties are enumerated and added as key-value pairs
array_splice($file->recipes, $jobj->ind, 0, array($jobj->recipe));

//  Encode data object back to JSON string to write to file
$jstr = json_encode($file, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);

//  Write new data string to file
file_put_contents('data/mealplan.json', $jstr);

//  Remove the deleted list from the JSON object and encode the resulting data for hashing
unset($file->deleted);
$jstr = json_encode($file, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);

//  Return new data hash
echo(hash('sha256', $jstr));

?>