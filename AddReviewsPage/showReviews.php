<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fish_website";

// Create connection with error handling
try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Query to fetch data with proper ordering (newest first)
    $sql = "SELECT Review, ReviewDes, ReviewLocation FROM reviews ORDER BY id DESC LIMIT 10";
    $result = $conn->query($sql);

    $data = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Sanitize output data
            $data[] = array(
                'Review' => intval($row['Review']),
                'ReviewDes' => htmlspecialchars($row['ReviewDes']),
                'ReviewLocation' => htmlspecialchars($row['ReviewLocation'])
            );
        }
    }

    // Return data as JSON
    header('Content-Type: application/json');
    echo json_encode($data);

} catch (Exception $e) {
    // Return error as JSON
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(array('error' => $e->getMessage()));
} finally {
    // Close connection if it exists
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>