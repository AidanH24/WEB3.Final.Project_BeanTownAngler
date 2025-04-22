<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fish_website";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = trim($_POST["UserName"]);
    $email = trim($_POST["Email"]);
    $pass = password_hash(trim($_POST["Password"]), PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO user (UserName, Email, Password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $user, $email, $pass);
    
    if ($stmt->execute()) {
        header("Location: ../Homepage/Home.html");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }
    
    $stmt->close();
}

$conn->close();
?>
