<?php
session_start();

$servername = "localhost";
$db_username = "root";
$db_password = "";
$dbname = "fish_website";

// Create connection
$conn = new mysqli($servername, $db_username, $db_password, $dbname);

// Check connection
if ($conn->connect_error) 
{
    die("Connection failed: " . $conn->connect_error);
}

if($_SERVER["REQUEST_METHOD"] == "POST")
{
    $user = trim($_POST["UserName"]);
    $pass = trim($_POST["Password"]);

    //SQL query
    $sql = "SELECT * FROM user WHERE UserName = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s",$user);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows >0)
    {
        $row = $result->fetch_assoc();

        if(password_verify($pass,$row["Password"]))
        {
            $_SESSION["user_id"] = $row["User_ID"];
            $_SESSION["username"] = $row["UserName"];

            header("Location:../HomePage/Home.html");
            exit();
        } 
        else
        {
            $error_message ="Invalid password.";
        }
    }
    else
    {
        $error_message = "No user found with that username.";
    }

    $stmt->close();
}

$conn->close();
?>