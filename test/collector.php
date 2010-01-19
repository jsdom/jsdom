<?php


$files = glob($_SERVER['argv'][1] . "/*.html");

$outputFile = $_SERVER['argv'][1] . "/index.js";

$functions = array();
$functionBodies = "";

foreach ($files as $file)
{
	$content = file_get_contents($file);
	
	$first = "// expose test function names";
	
	$start = strpos($content, $first);
	$end   = strpos($content, "</script>", $start + strlen($first));


	$substring = substr($content, $start+$first, $end-$start);
	
	preg_match("/return \['([\w]+)'\]/", $substring,$matches);
	
	$function = $matches[1];
	
	array_push($functions, $function);
	
	// parse out the actual function
	$functionBodies .= "\r\n" . substr($substring, strpos($substring, "/**"));

	
}

$imploded = implode("','", array_filter($functions));

$output = "// expose test function names
function exposeTestFunctionNames()
{
return ['{$imploded}'];
        
}


" . $functionBodies;

file_put_contents($outputFile, $output);