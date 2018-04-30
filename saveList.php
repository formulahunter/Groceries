<?php

//  Load SimpleXML element from string
$simple = simplexml_load_string(str_replace("--", "&ndash;", str_replace("#amp#", "&amp;", $_POST['xmlStr'])));

//  Convert to DOMElement
$domel = dom_import_simplexml($simple);

//  Load Archive as DOMDocument
$doc = new DOMDocument();
$doc->load("data.xml");

//  Import new node into DOMDocument
$node = $doc->importNode($domel, true);

//  Position new node
$doc->documentElement->appendChild($node);

//  Validate resulting document against schema
//  Write new document to file
echo(file_put_contents("data.xml", $doc->saveXML()));

?>