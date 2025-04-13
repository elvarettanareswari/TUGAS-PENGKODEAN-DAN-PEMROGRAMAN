<?php
include 'koneksi.php';
$data = [];
$result = $conn->query("SELECT * FROM produk");
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode($data);
?>
