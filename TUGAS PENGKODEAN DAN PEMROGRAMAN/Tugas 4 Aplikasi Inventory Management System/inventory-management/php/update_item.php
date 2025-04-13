<?php
include 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

$id = (int)$data['id'];
$name = mysqli_real_escape_string($conn, $data['name']);
$quantity = (int)$data['quantity'];
$price = (float)$data['price'];
$category = mysqli_real_escape_string($conn, $data['category']);

$sql = "UPDATE items SET name='$name', quantity=$quantity, price=$price, category='$category' WHERE id=$id";
$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
}

mysqli_close($conn);
?>