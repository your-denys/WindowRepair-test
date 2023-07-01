<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    // Add your email address here
    $to = "mail@example.com";
    $subject = "New message from $name";
    $headers = "From: $email";

    $emailContent = "Name: $name\n";
    $emailContent .= "Email: $email\n";
    $emailContent .= "Message: $message\n";

    if (mail($to, $subject, $message, $headers)) {
        echo "Success!";
    } else {
        echo "Error";
    }
}