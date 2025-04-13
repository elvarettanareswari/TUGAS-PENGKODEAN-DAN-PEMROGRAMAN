<?php
require 'koneksi.php';

$id = $_POST['id'];
$jumlah = intval($_POST['jumlah']);
$total = intval($_POST['total']);

// Ambil produk berdasarkan ID
$query = $conn->query("SELECT * FROM produk WHERE id = $id");
$produk = $query->fetch_assoc();

if (!$produk) {
    echo "Produk tidak ditemukan";
    exit;
}

if ($produk['stok'] < $jumlah) {
    echo "Stok tidak mencukupi";
    exit;
}

$conn->query("UPDATE produk SET stok = stok - $jumlah WHERE id = $id");

// Simpan transaksi
$nama = $conn->real_escape_string($produk['nama']);
$conn->query("INSERT INTO transaksi (produk_id, nama, jumlah, total)
              VALUES ($id, '$nama', $jumlah, $total)");

echo "success";
?>
