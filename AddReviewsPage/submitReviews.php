<?php
$servername = "localhost"; // Change if needed
$username = "root"; // Change to your database user
$password = ""; // Change to your database password
$dbname = "reviews"; // Change to your actual database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if POST data is received
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $Review = isset($_POST["Review"]) ? intval($_POST["Review"]) : 0;
    $ReviewDes = isset($_POST["ReviewDes"]) ? trim($_POST["ReviewDes"]) : "";
    $ReviewLocation	= isset($_POST["ReviewLocation"]) ? trim($_Post["ReviewLocation"]) : "";

    if ($Review > 0 && !empty($ReviewDes) && !empty($ReviewLocation)) {
        $stmt = $conn->prepare("INSERT INTO reviews (Review, ReviewDes) VALUES (?, ?)");
        $stmt->bind_param("is", $Review, $ReviewDes);

        if ($stmt->execute()) {
            echo "Review submitted successfully!";
        } else {
            echo "Error: " . $conn->error;
        }

        $stmt->close();
    } else {
        echo "Invalid input!";
    }
}

$conn->close();
?>
