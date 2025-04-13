<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$stok = $_POST['stok'];
$harga = $_POST['harga'];

$stmt = $conn->prepare("INSERT INTO produk (nama, stok, harga) VALUES (?, ?, ?)");
$stmt->bind_param("sii", $nama, $stok, $harga);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error";
}
?>
