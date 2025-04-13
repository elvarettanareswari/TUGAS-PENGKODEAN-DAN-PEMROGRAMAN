<?php
include 'koneksi.php';

header("Content-type: application/vnd-ms-excel");
header("Content-Disposition: attachment; filename=data_produk.xls");

echo "<table border='1'>
<tr>
    <th>No</th>
    <th>Nama Produk</th>
    <th>Stok</th>
    <th>Harga</th>
</tr>";

$no = 1;
$data = $conn->query("SELECT * FROM produk");
while ($row = $data->fetch_assoc()) {
    echo "<tr>
        <td>" . $no++ . "</td>
        <td>" . $row['nama'] . "</td>
        <td>" . $row['stok'] . "</td>
        <td>" . $row['harga'] . "</td>
    </tr>";
}
echo "</table>";
?>
