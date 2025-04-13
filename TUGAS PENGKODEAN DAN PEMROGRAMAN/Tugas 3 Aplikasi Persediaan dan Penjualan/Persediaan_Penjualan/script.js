let produkList = [];
let transaksiList = [];

function updateDashboard() {
    document.getElementById("total-produk").innerText = produkList.length;
    const totalStok = produkList.reduce((sum, p) => sum + parseInt(p.stok), 0);
    document.getElementById("total-stok").innerText = totalStok;
    const totalUang = transaksiList.reduce((sum, t) => sum + parseInt(t.total), 0);
    document.getElementById("total-transaksi").innerText = `Rp ${totalUang.toLocaleString()}`;
    document.getElementById("total-semua").innerText = `Rp ${totalUang.toLocaleString()}`;
}

function renderProduk() {
    const tbody = document.getElementById("produk-body");
    tbody.innerHTML = "";
    const selects = ["produk-edit", "produk-update", "produk-jual"];
    selects.forEach(id => document.getElementById(id).innerHTML = "");

    produkList.forEach((p, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.nama}</td>
            <td>${p.stok}</td>
            <td>Rp ${parseInt(p.harga).toLocaleString()}</td>
            <td><button onclick="hapusProduk(${i})">Hapus</button></td>
        `;
        tbody.appendChild(tr);

        selects.forEach(id => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.text = p.nama;
            document.getElementById(id).appendChild(opt);
        });
    });

    updateDashboard();
}

function tambahProduk() {
    const nama = document.getElementById("nama").value.trim();
    const stok = parseInt(document.getElementById("stok").value);
    const harga = parseInt(document.getElementById("harga").value);

    if (!nama || isNaN(stok) || isNaN(harga)) return alert("Lengkapi semua kolom!");

    fetch('tambah_produk.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `nama=${encodeURIComponent(nama)}&stok=${stok}&harga=${harga}`
    })
    .then(res => res.text())
    .then(response => {
        if (response === "success") {
            loadProduk();
            document.getElementById("nama").value = "";
            document.getElementById("stok").value = "";
            document.getElementById("harga").value = "";
        } else {
            alert("Gagal menambah produk: " + response);
        }
    });
}

function loadProduk() {
    fetch('get_produk.php')
        .then(res => res.json())
        .then(data => {
            produkList = data;
            renderProduk();
        });
}

// ➕ Fungsi jual produk
function jualProduk() {
    const index = document.getElementById("produk-jual").value;
    const jumlah = parseInt(document.getElementById("jumlah-jual").value);
    if (isNaN(jumlah) || jumlah <= 0) return alert("Masukkan jumlah yang valid");

    const produk = produkList[index];
    if (produk.stok < jumlah) return alert("Stok tidak mencukupi");

    const total = jumlah * produk.harga;

    fetch('jual_produk.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${produk.id}&jumlah=${jumlah}&total=${total}`
    })
    .then(res => res.text())
    .then(response => {
        if (response === "success") {
            loadProduk();
            loadTransaksi();
            document.getElementById("jumlah-jual").value = "";
        } else {
            alert("Gagal menjual produk: " + response);
        }
    });
}

// ➕ Ambil data transaksi dari server
function loadTransaksi() {
    fetch('get_transaksi.php')
        .then(res => res.json())
        .then(data => {
            transaksiList = data;
            renderTransaksi();
        });
}

function renderTransaksi() {
    const tbody = document.getElementById("transaksi-body");
    tbody.innerHTML = "";
    transaksiList.forEach(t => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${t.nama}</td><td>${t.jumlah}</td><td>Rp ${parseInt(t.total).toLocaleString()}</td>`;
        tbody.appendChild(tr);
    });
    updateDashboard();
}

function filterProduk() {
    const input = document.getElementById("filter-produk").value.toLowerCase();
    const rows = document.getElementById("produk-body").getElementsByTagName("tr");
    for (let row of rows) {
        const nama = row.cells[0].innerText.toLowerCase();
        row.style.display = nama.includes(input) ? "" : "none";
    }
}

function exportProdukExcel() {
    let csv = "Nama,Stok,Harga\n";
    produkList.forEach(p => {
        csv += `${p.nama},${p.stok},${p.harga}\n`;
    });
    downloadCSV(csv, "produk.csv");
}

function exportTransaksiExcel() {
    let csv = "Produk,Jumlah,Total\n";
    transaksiList.forEach(t => {
        csv += `${t.nama},${t.jumlah},${t.total}\n`;
    });
    downloadCSV(csv, "transaksi.csv");
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Load data saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadProduk();
    loadTransaksi(); // Tambahan!
});

function editProduk() {
    const index = document.getElementById("produk-edit").value;
    const namaBaru = document.getElementById("nama-edit").value.trim();
    const stokBaru = parseInt(document.getElementById("stok-edit").value);
    const hargaBaru = parseInt(document.getElementById("harga-edit").value);

    if (!namaBaru || isNaN(stokBaru) || isNaN(hargaBaru)) return alert("Lengkapi semua kolom!");

    const produk = produkList[index];

    fetch('edit_produk.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${produk.id}&nama=${encodeURIComponent(namaBaru)}&stok=${stokBaru}&harga=${hargaBaru}`
    })
    .then(res => res.text())
    .then(response => {
        if (response === "success") {
            loadProduk();
            document.getElementById("nama-edit").value = "";
            document.getElementById("stok-edit").value = "";
            document.getElementById("harga-edit").value = "";
        } else {
            alert("Gagal edit produk: " + response);
        }
    });
}

function updateStok() {
    const index = document.getElementById("produk-update").value;
    const tambahan = parseInt(document.getElementById("tambah-stok").value);
    if (isNaN(tambahan) || tambahan <= 0) return alert("Masukkan angka yang valid!");

    const produk = produkList[index];

    fetch('update_stok.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${produk.id}&tambahan=${tambahan}`
    })
    .then(res => res.text())
    .then(response => {
        if (response === "success") {
            loadProduk();
            document.getElementById("tambah-stok").value = "";
        } else {
            alert("Gagal update stok: " + response);
        }
    });
}

