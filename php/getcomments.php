<?php

//db connection details
$host = "10.10.50.92";
$user = "devel";
$password = "admin4mysql";
$database = "morozov_review";

//make connection
$mysqli = new mysqli($host, $user, $password, $database);
$mysqli->set_charset("utf8");

//query the database
$result = $mysqli->query("SELECT * FROM reviews");

//loop through and return results
for ($i = 0, $numrows = mysqli_num_rows($result); $i < $numrows; $i++) {
    $row = mysqli_fetch_assoc($result);

    $reviews[$i] = array(
        "name" => $row["name"],
        "text" => $row["text"],
        "date" => $row["date"]
    );
}

//echo JSON to page
$response = json_encode($reviews);
echo $response;
?>