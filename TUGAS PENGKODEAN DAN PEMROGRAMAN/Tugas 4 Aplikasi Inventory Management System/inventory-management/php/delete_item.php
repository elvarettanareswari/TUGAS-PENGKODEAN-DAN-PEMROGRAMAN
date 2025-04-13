<?php
include 'config.php';
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];

$sql = "DELETE FROM items WHERE id = $id";
$result = mysqli_query($conn, $sql);

echo json_encode(['success' => $result]);
?>