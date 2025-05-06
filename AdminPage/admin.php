<?php
// Ensure detailed errors are displayed during debugging
// Comment these out in production
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Always set content type to JSON
header("Content-Type: application/json");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fish_website";

$response = ["success" => false, "data" => [], "error" => ""];

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Invalid request method. Only POST requests are allowed.");
    }

    // Validate and sanitize inputs
    if (!isset($_POST["table"]) || empty($_POST["table"])) {
        throw new Exception("Table parameter is required.");
    }
    
    $table = htmlspecialchars($_POST["table"]);
    $searchValue = isset($_POST["search_value"]) ? htmlspecialchars($_POST["search_value"]) : "";
    
    // Debug info - useful during development
    $response["debug"] = ["table" => $table, "search" => $searchValue];
    
    // Validate table name against whitelist
    $allowedTables = ['reviews', 'user']; // Replace with your actual table names
    if (!in_array($table, $allowedTables)) {
        throw new Exception("Invalid table selected: " . $table);
    }

    // Connect to database
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Prepare SQL based on table
    if ($table == 'reviews') {
        // Check if search value is numeric (likely an ID search)
        if (is_numeric($searchValue)) {
            $sql = "SELECT * FROM reviews WHERE ReviewID = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("SQL preparation failed: " . $conn->error);
            }
            $stmt->bind_param("i", $searchValue); // Use integer binding for ID
        } else {
            // Search in multiple relevant fields for reviews
            $sql = "SELECT * FROM reviews WHERE Title LIKE ? OR Content LIKE ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("SQL preparation failed: " . $conn->error);
            }
            $searchParam = "%" . $searchValue . "%";
            $stmt->bind_param("ss", $searchParam, $searchParam);
        }
    } else if ($table == 'user') {
        // Search in multiple relevant fields for users
        $sql = "SELECT * FROM user WHERE UserName LIKE ? OR Email LIKE ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("SQL preparation failed: " . $conn->error);
        }
        $searchParam = "%" . $searchValue . "%";
        $stmt->bind_param("ss", $searchParam, $searchParam);
    } else {
        throw new Exception("Table handling not implemented.");
    }

    // Execute query and process results
    if (!$stmt->execute()) {
        throw new Exception("Query execution failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    if (!$result) {
        throw new Exception("Result retrieval failed: " . $stmt->error);
    }
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        // Remove sensitive data if present
        if ($table == 'user' && isset($row['Password'])) {
            unset($row['Password']);
        }
        $data[] = $row;
    }

    $response["success"] = true;
    $response["data"] = $data;
    $response["count"] = count($data);

    // Close statement and connection
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    $response["error"] = $e->getMessage();
    
    // Log error for server-side debugging
    error_log("Search handler error: " . $e->getMessage());
}

// Ensure valid JSON output no matter what
echo json_encode($response);
exit;
?>