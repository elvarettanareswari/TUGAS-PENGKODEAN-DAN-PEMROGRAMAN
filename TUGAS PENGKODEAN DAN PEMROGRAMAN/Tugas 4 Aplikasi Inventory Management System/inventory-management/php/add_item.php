<?php
include 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

$name = mysqli_real_escape_string($conn, $data['name']);
$quantity = (int)$data['quantity'];
$price = (float)$data['price'];
$category = mysqli_real_escape_string($conn, $data['category']);

// Cek apakah item dengan nama yang sama sudah ada (opsional, untuk mencegah duplikat)
$sql_check = "SELECT id FROM items WHERE name = '$name' AND category = '$category'";
$result_check = mysqli_query($conn, $sql_check);

if (mysqli_num_rows($result_check) > 0) {
    echo json_encode(['success' => false, 'error' => 'Item already exists']);
    exit;
}

$sql = "INSERT INTO items (name, quantity, price, category) VALUES ('$name', $quantity, $price, '$category')";
$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
}

mysqli_close($conn);
?>