<?php
include 'koneksi.php'; // pastikan file koneksi ini sesuai

$id = $_POST['id'];
$tambahan = $_POST['tambahan'];

// Ambil stok lama
$query = mysqli_query($conn, "SELECT stok FROM produk WHERE id = $id");
$data = mysqli_fetch_assoc($query);
$stokLama = $data['stok'];

// Hitung stok baru
$stokBaru = $stokLama + $tambahan;

// Update stok di database
$update = mysqli_query($conn, "UPDATE produk SET stok = $stokBaru WHERE id = $id");

if ($update) {
    echo "success";
} else {
    echo "error";
}
?>
