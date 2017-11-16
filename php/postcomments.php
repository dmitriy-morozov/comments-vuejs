<?php
//db connection details
$host = "10.10.50.92";
$user = "devel";
$password = "admin4mysql";
$database = "morozov_review";

//make connection
$mysqli = new mysqli($host, $user, $password, $database);
$mysqli->set_charset("utf8");

//get POST data
$_POST = json_decode(file_get_contents('php://input'), true);
var_dump($_POST);
$postName = $mysqli->real_escape_string($_POST["name"]);
$postText = $mysqli->real_escape_string($_POST["text"]);
$postDay = $mysqli->real_escape_string($_POST["day"]);
$postMonth = $mysqli->real_escape_string($_POST["month"]);
$postYear = $mysqli->real_escape_string($_POST["year"]);

//add new comment to database
$result = $mysqli->real_query("INSERT INTO reviews (name, text, day, month, year) VALUES ('$postName', '$postText', '$postDay', '$postMonth', '$postYear')");

?>
