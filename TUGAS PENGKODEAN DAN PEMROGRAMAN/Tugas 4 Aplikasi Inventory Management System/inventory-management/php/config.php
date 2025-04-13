<?php
$host = "localhost";
$user = "root"; // Ganti jika username MySQL Anda berbeda
$pass = "";    // Ganti jika ada password
$db = "inventory_db";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>