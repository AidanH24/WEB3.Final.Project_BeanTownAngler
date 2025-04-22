<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "reviews";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch reviews
$sql = "SELECT Review, ReviewDes, created_at FROM reviews ORDER BY created_at DESC";
$result = $conn->query($sql);

$reviews = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
}

// Return reviews as JSON
header('Content-Type: application/json');
echo json_encode($reviews);

$conn->close();
?>
