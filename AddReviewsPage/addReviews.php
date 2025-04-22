<?php
// Database connection
$servername = "localhost"; // Change if needed
$username = "root"; // Change if needed
$password = ""; // Change if needed
$dbname = "fish_website"; // Change to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize form data
    $review = isset($_POST['Review']) ? intval($_POST['Review']) : 0;
    $reviewDes = trim(htmlspecialchars($_POST['ReviewDes']));
    $reviewLocation = trim(htmlspecialchars($_POST['ReviewLocation']));

    // Validate input
    $errors = [];

    if ($review < 1 || $review > 5) {
        $errors[] = "Please select a rating between 1 and 5 stars.";
    }

    if (empty($reviewDes)) {
        $errors[] = "Please enter a review description.";
    }

    if (empty($reviewLocation)) {
        $errors[] = "Please enter a review location.";
    }

    // If no errors, proceed with insertion
    if (empty($errors)) {
        // Prepare and bind to prevent SQL injection
        $stmt = $conn->prepare("INSERT INTO reviews (Review, ReviewDes, ReviewLocation) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $review, $reviewDes, $reviewLocation);

        // Execute and check success
        if ($stmt->execute()) {
            // Redirect with success parameter
            header("Location: addReviews.html?success=true");
            exit();
        } else {
            $errors[] = "Error: " . $stmt->error;
        }

        $stmt->close();
    }

    // If there are errors, redirect back with error messages
    if (!empty($errors)) {
        // Convert errors to string and redirect
        $errorString = implode("|", $errors);
        header("Location: addReviews.html?error=" . urlencode($errorString));
        exit();
    }
}

$conn->close();
?>