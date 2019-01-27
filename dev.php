<html>

<head>
    <title>Data Reconciliation Development</title>
</head>
<body>
<p>
<?php

abstract class IDConflict
{
    //  Enumerate all possible conflict "ranks"
    const Indeterminant = 0;
    const ResolveSource = 1;
    const ResolveTarget = 2;
    const None          = 3;
}

/*class DataStore {
    public $new;
    public $modified;
    public $deleted;
    public $conflicts;

    public function __constructor() {
        $this->new = new stdClass();
        $this->modified = new stdClass();
        $this->deleted = new stdClass();
        $this->conflicts = new stdClass();
    }
}*/

echo '<h1>START</h1>';

$jdat = json_decode(file_get_contents('data/mealplan.json'));
echo '<h3>$jdat:</h3>';
echo '<pre>';
echo print_r($jdat, true);
echo '</pre>';

$recon = json_decode("{}");
echo '<h3>$recon:</h3>';
echo '<pre>';
echo print_r($recon, true);
echo '</pre>';

//  `$compiled` is a container of containers for each data type/status combo, e.g. ingredients-new, ingredients-modified, etc.
$compiled = new stdClass();
foreach($jdat as $type => $value) {
    if($type === "deleted")
        continue;

    $compiled->$type = new stdClass();
    $compiled->$type->new = new stdClass();
    $compiled->$type->modified = new stdClass();
    $compiled->$type->deleted = new stdClass();
    $compiled->$type->conflicts = new stdClass();
}
echo '<h3>$compiled:</h3>';
echo '<pre>';
echo print_r($compiled, true);
echo '</pre>';

$lastSync = 0;
echo '<h3>$lastSync:</h3>';
echo '<pre>';
echo print_r($lastSync, true);
echo '</pre>';

//  Check for ID conflicts and resolve
//  The following nested loops iterate over every type/status combination
//    - Server data is compared against the client data first
//      - Conflicts are removed from the client data array and added to the `$compiled` array regardless of conflict rank
//    - Any client data remaining in `$recon` is then checked against the server data
//
//  After the entire reconciliation algorithm is complete:
//    - `$jdat` will be encoded and re-written to the server data file
//    - `$compiled` will be returned to the client with changes since its last sync, including unresolved conflicts
//  Therefore every data instance created/modified since the last sync should be sorted into one of these two containers
$server = new stdClass();
foreach($compiled as $type => $typeArr) {
    echo $type . '<br />';
    //  Skip `$compiled->hash` which is a `number`
    if(!is_object($typeArr)) {
        continue;
    }

    //  Select instances from `$jdat` that have been created, modified, or deleted since `$lastSync`
    $server->$type = new stdClass();
    foreach ($jdat->$type as $serverInst) {
        //  Note that `$type` values are coming from `$compiled` so no need to check for `$type === "deleted"`
        $id = $serverInst->_created;

        //  Check if the instance was created since `$lastSync`
        //  If not, check if it was modified since `$lastSync`
        if ($id > $lastSync) {
            if (!isset($server->$type->new)) {
                $server->$type->new = new stdClass();
            }
            $server->$type->new->$id = $serverInst;
        } else if ((isset($serverInst->_modified) && $serverInst->_modified > $lastSync)) {
            if (!isset($server->$type->modified)) {
                $server->$type->modified = new stdClass();
            }
            $server->$type->modified->$id = $serverInst;
        }
    }
    foreach ($jdat->deleted->$type as $serverInst) {
        $id = $serverInst->_created;

        //  Check if the instance was deleted since `$lastSync`
        if ($serverInst->_deleted > $lastSync) {
            if (!isset($server->$type->deleted)) {
                $server->$type->deleted = new stdClass();
            }
            $server->$type->deleted->$id = $serverInst;
        }
    }


    //  Iterate through screened server data instances
    //    - Compare with all instances received from the client
    //      - If any matches, mark as indeterminate
    //        - Check for matches by `$id`
    //        - Check for matches by text
    //        - Check for matches by text excluding timestamps
    //      - If no matches, add to `$compiled`
    foreach($server->$type as $serverStatus => $serverStatusArray) {
        foreach($serverStatusArray as $id => $serverInst) {
            //  Assign `$serverInst` to `$compiled` as if no conflict will be found
            $compiled->$type->$serverStatus->$id = $serverInst;
            if(!isset($recon->type))
                continue;

            //  Check for conflicts and move `$serverInst` accordingly
            foreach($recon->$type as $clientStatus => $clientStatusArray) {
                //  If not conflict exists, move on to the next client status
                if(isset($clientStatusArray->$id)) {
                    //  Assign local reference to matching instance in `$clientStatusArray`
                    $clientInst = $clientStatusArray->$id;

                    //  Assign conflicting instances to the 'conflicts' array based on `$type`
                    //  `$serverInst` will always be the first instance in this array
                    if(is_array($compiled->$type->conflicts->$id)) {
                        //  If the conflicts array has already been defined, just push the new instance
                        $compiled->$type->conflicts->$id[] = $clientInst;
                    }
                    else {
                        //  If this is the first conflict for this id:
                        //    - Create a conflict array containing the two instances
                        //    - Remove `$serverInst` from the non-conflict location in `$compiled`
                        $compiled->$type->conflicts->$id = array($serverInst, $clientInst);
                        unset($compiled->$type->$serverStatus->$id);
                    }

                    //  Remove the matching instance from the client data array
                    unset($clientStatusArray->$id);
                }
                /*else {
                    //  Check JSON text excluding timestamps
                    $serverClone = clone $serverInst;
                    $clientClone = clone $clientInst;

                    //  If match is found excluding timestamps, evaluate timestamps:
                    //    - If equal, mark as resolved with server value
                    //    - If not equal, mark as conflict to confirm duplicate on client

                    //  Remove the matching instance from the client data array
                    unset($clientStatusArray->$id);
                }*/
            }
        }
    }

    //  Iterate through remaining client data instances
    //    - Compare with all instances stored on the server
    //    - Assign a resolved value of each into `$jdat` or `$compiled`
    if(isset($recon->$type) && isset($recon->$type->new)) {
        foreach($recon->$type->new as $id => $clientInst) {
            $conflicts = array_filter($jdat->$type, function($val) use ($id) {return $val->_created === $id;});
            if(count($conflicts) > 0) {
                array_unshift($conflicts, $clientInst);
                $compiled->$type->conflicts->$id = $conflicts;
            }
            else {
                array_unshift($jdat->$type, $clientInst);
            }
        }
    }
    if(isset($recon->$type) && isset($recon->$type->modified)) {
        foreach($recon->$type->modified as $id => $clientInst) {
            $matches = array_filter($jdat->$type, function($val) use ($id) {return $val->_created === $id;});
            if(count($matches) === 0) {
                $compiled->$type->conflicts->$id = array($clientInst);
                //  If another instance has already been deleted, add it to the conflicts list
                $deleted = array_filter($jdat->deleted->$type, function($val) use ($id) {return $val->_created === $id;});
                if(count($deleted) > 0) {
                    array_splice($compiled->$type->conflicts->$id, 0, 0, $deleted);
                }
            }
            else if(count($matches) > 1) {
                array_push($matches, $clientInst);
                $compiled->$type->conflicts->$id = $matches;
            }
            else {
                $ind = array_search($matches[0], $jdat->$type);
                array_splice($jdat->$type, $ind, 1, $matches);
            }
        }
    }
    if(isset($recon->$type) && isset($recon->$type->deleted)) {
        foreach($recon->$type->deleted as $id => $clientInst) {
            $matches = array_filter($jdat->$type, function($val) use ($id) {return $val->_created === $id;});
            if(count($matches) === 0) {
                $compiled->$type->conflicts->$id = array($clientInst);
            }
            else if(count($matches) > 1) {
                array_push($matches, $clientInst);
                $compiled->$type->conflicts->$id = $matches;
            }
            else {
                $ind = array_search($jdat->$type, $clientInst);
                array_splice($jdat->$type, $ind, 1);
                array_unshift($jdat->deleted->$type, $clientInst);
            }
        }
    }
    /*foreach($recon->$type as $clientStatus => $clientStatusArray) {
        foreach($clientStatusArray as $id => $clientInst) {
            //  Add the new client instance to the beginning of the server array as if no conflicts will be found
            foreach($jdat->$type as $serverTypeArray) {
                array_shift($serverTypeArray, $clientInst);
                foreach($serverTypeArray as $ind => $serverInst) {
                    if($serverInst->_created !== $id) {
                        continue;
                    }

                    //  If a conflict is found, relocate the client instance from the beginning of the array to the location of the matched server instance
                }
            }
        }
    }*/
}

echo '<h3>$server:</h3>';
echo '<pre>';
echo print_r($server, true);
echo '</pre>';

echo '<h1>END</h1>';

echo '<h3>$jdat:</h3>';
echo '<pre>';
echo print_r($jdat, true);
echo '</pre>';

echo '<h3>$recon:</h3>';
echo '<pre>';
echo print_r($recon, true);
echo '</pre>';

echo '<h3>$compiled:</h3>';
echo '<pre>';
echo print_r($compiled, true);
echo '</pre>';

//  Compare JSON encodings of two data instances with `_created`, `_modified`, and `_deleted` properties removed
function compareJSON($server, $client) {
    //  Create clones of each object so as to not modify the originals
    $serverClone = clone $server;
    $clientClone = clone $client;

    //  Remove `_modified` and `_deleted` properties from each instance
    unset($serverClone->_created);
    unset($serverClone->_modified);
    unset($serverClone->_deleted);
    unset($clientClone->_created);
    unset($clientClone->_modified);
    unset($clientClone->_deleted);

    //  Serialize objects
    $serverStr = json_encode($serverClone, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    $clientStr = json_encode($clientClone, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);

    //  Return the equality comparison
    return $serverStr === $clientStr;
}

//  Construct hash table excluding _created, _modified, and _deleted properties to check for duplicate entries

?>
</p>
</body>
</html>