<?php
$conn = new mysqli("localhost", "root", "", "persediaan_penjualan");

if ($conn->connect_error) {
  die("Koneksi gagal: " . $conn->connect_error);
}
?>
