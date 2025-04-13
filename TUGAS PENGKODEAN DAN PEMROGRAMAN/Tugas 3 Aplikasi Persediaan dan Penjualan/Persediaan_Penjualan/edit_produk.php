<?php
$conn = new mysqli("localhost", "root", "", "persediaan_penjualan");

$id = $_POST['id'];
$nama = $_POST['nama'];
$stok = $_POST['stok'];
$harga = $_POST['harga'];

$sql = "UPDATE produk SET nama='$nama', stok=$stok, harga=$harga WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo "success";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
