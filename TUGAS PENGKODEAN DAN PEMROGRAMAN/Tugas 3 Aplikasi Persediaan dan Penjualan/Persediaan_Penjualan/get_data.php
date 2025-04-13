<?php
include 'koneksi.php';

$produk = [];
$transaksi = [];

// Ambil data produk
$p = $conn->query("SELECT * FROM produk");
while ($row = $p->fetch_assoc()) {
    $produk[] = $row;
}

// Ambil data transaksi dan join dengan nama produk
$t = $conn->query("
    SELECT transaksi.*, produk.nama 
    FROM transaksi 
    JOIN produk ON transaksi.produk_id = produk.id
");
while ($row = $t->fetch_assoc()) {
    $transaksi[] = $row;
}

// Gabungkan jadi satu array
$data = [
    "produk" => $produk,
    "transaksi" => $transaksi
];

// Kembalikan dalam format JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
