<?php
include 'koneksi.php';

header("Content-type: application/vnd-ms-excel");
header("Content-Disposition: attachment; filename=data_transaksi.xls");

echo "<table border='1'>
<tr>
    <th>No</th>
    <th>Nama Produk</th>
    <th>Jumlah Terjual</th>
    <th>Total</th>
    <th>Tanggal</th>
</tr>";

$no = 1;
$data = $conn->query("
    SELECT transaksi.*, produk.nama 
    FROM transaksi 
    JOIN produk ON transaksi.produk_id = produk.id
");

while ($row = $data->fetch_assoc()) {
    echo "<tr>
        <td>" . $no++ . "</td>
        <td>" . $row['nama'] . "</td>
        <td>" . $row['jumlah'] . "</td>
        <td>" . $row['total'] . "</td>
        <td>" . $row['tanggal'] . "</td>
    </tr>";
}
echo "</table>";
?>
