CREATE TABLE produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100),
    stok INT,
    harga INT
);

CREATE TABLE transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produk_id INT,
    jumlah INT,
    total INT,
    FOREIGN KEY (produk_id) REFERENCES produk(id)
);
