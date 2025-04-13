<?php
require 'koneksi.php';

$result = $conn->query("SELECT * FROM transaksi ORDER BY id DESC");
$transaksi = [];

while ($row = $result->fetch_assoc()) {
    $transaksi[] = $row;
}

header('Content-Type: application/json');
echo json_encode($transaksi);
?>
