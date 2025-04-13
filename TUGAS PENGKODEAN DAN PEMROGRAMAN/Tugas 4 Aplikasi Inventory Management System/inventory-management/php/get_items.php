<?php
include 'config.php';
header('Content-Type: application/json');

$sql = "SELECT * FROM items";
$result = mysqli_query($conn, $sql);

$items = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Konversi price ke float
    $row['price'] = (float)$row['price'];
    $row['quantity'] = (int)$row['quantity']; // Pastikan quantity juga dalam format integer
    $items[] = $row;
}

echo json_encode($items);

mysqli_close($conn);
?>