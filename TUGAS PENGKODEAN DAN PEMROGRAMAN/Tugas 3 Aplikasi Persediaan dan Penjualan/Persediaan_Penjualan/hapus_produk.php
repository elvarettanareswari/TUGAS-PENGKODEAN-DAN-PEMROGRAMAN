<?php
include "koneksi.php";
$id = $_POST['id'];
$koneksi->query("DELETE FROM produk WHERE id=$id");
?>