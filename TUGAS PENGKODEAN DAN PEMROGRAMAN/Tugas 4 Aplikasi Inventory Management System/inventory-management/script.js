document.addEventListener('DOMContentLoaded', () => {
    loadItems();

    // Add Item
    const addForm = document.getElementById('addForm');
    const addButton = document.getElementById('addButton');
    const loadingIndicator = document.getElementById('loading');

    if (!addForm) {
        console.error('Form with ID "addForm" not found.');
        return;
    }
    if (!addButton) {
        console.error('Button with ID "addButton" not found.');
        return;
    }
    if (!loadingIndicator) {
        console.error('Loading indicator with ID "loading" not found.');
        return;
    }

    addForm.removeEventListener('submit', handleAddItem);
    addForm.addEventListener('submit', handleAddItem);

    function handleAddItem(e) {
        e.preventDefault();

        console.log('Add Item form submitted');

        addButton.disabled = true;
        loadingIndicator.style.display = 'inline';

        const quantity = parseInt(document.getElementById('quantity').value);
        const price = parseFloat(document.getElementById('price').value);

        if (quantity < 0 || price < 0) {
            alert('Quantity and Price cannot be negative!');
            addButton.disabled = false;
            loadingIndicator.style.display = 'none';
            return;
        }

        const item = {
            name: document.getElementById('name').value,
            quantity: quantity,
            price: price,
            category: document.getElementById('category').value
        };

        console.log('Data to be sent:', item);

        fetch('php/add_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from add_item.php:', data);
            if (data.success) {
                loadItems();
                addForm.reset();
                showNotification('Item added successfully!');
            } else {
                showNotification('Error adding item: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            showNotification('Failed to add item. Check console for details.');
        })
        .finally(() => {
            addButton.disabled = false;
            loadingIndicator.style.display = 'none';
        });
    }

    // Update Item
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const quantity = parseInt(document.getElementById('editQuantity').value);
            const price = parseFloat(document.getElementById('editPrice').value);

            if (quantity < 0 || price < 0) {
                alert('Quantity and Price cannot be negative!');
                return;
            }

            const item = {
                id: document.getElementById('editId').value,
                name: document.getElementById('editName').value,
                quantity: quantity,
                price: price,
                category: document.getElementById('editCategory').value
            };

            fetch('php/update_item.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadItems();
                    modal.style.display = 'none';
                    showNotification('Item updated successfully!');
                } else {
                    showNotification('Error updating item: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => console.error('Error updating item:', error));
        });
    }
});

// Fungsi untuk memformat harga ke dalam format Rupiah
function formatRupiah(angka) {
    const numberValue = parseFloat(angka);
    if (isNaN(numberValue)) {
        return 'Rp 0,00';
    }

    const numberString = numberValue.toFixed(2).toString();
    const split = numberString.split('.');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return 'Rp ' + rupiah;
}

// Pagination variables
let currentPage = 1;
let itemsPerPage = 5; // Hanya satu deklarasi, menggunakan let agar bisa diubah

// Fungsi untuk mengubah jumlah item per halaman
function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPageSelect').value);
    currentPage = 1; // Reset ke halaman 1
    loadItems();
}

// Fungsi untuk menampilkan nomor halaman
function renderPageNumbers(totalPages) {
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('span');
        pageLink.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageLink.textContent = i;
        pageLink.onclick = () => {
            currentPage = i;
            loadItems();
        };
        pageNumbers.appendChild(pageLink);
    }
}

// Load Items
function loadItems() {
    fetch('php/get_items.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const table = document.getElementById('inventoryTable');
            table.innerHTML = '';

            // Hitung total halaman
            const totalPages = Math.ceil(data.length / itemsPerPage);
            currentPage = Math.min(currentPage, totalPages);
            if (currentPage < 1) currentPage = 1;

            // Ambil data untuk halaman saat ini
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedData = data.slice(start, end);

            if (paginatedData.length === 0) {
                table.innerHTML = '<tr><td colspan="6" style="text-align: center;">No items available.</td></tr>';
            } else {
                let lowStockItems = [];
                paginatedData.forEach(item => {
                    const isLowStock = item.quantity < 5;
                    if (isLowStock) {
                        lowStockItems.push(item.name);
                    }
                    const row = `
                        <tr class="${isLowStock ? 'low-stock' : ''}">
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${formatRupiah(item.price)}</td>
                            <td>${item.category}</td>
                            <td>
                                <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                            </td>
                        </tr>`;
                    table.innerHTML += row;
                });
                if (lowStockItems.length > 0) {
                    showNotification(`Low stock alert: ${lowStockItems.join(', ')}`);
                }
            }

            // Update pagination
            renderPageNumbers(totalPages);
            document.getElementById('prevButton').disabled = currentPage === 1;
            document.getElementById('nextButton').disabled = currentPage === totalPages;
        })
        .catch(error => {
            console.error('Error loading items:', error);
            showNotification('Failed to load items. Check console for details.');
        });
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadItems();
    }
}

function nextPage() {
    fetch('php/get_items.php')
        .then(response => response.json())
        .then(data => {
            const totalPages = Math.ceil(data.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                loadItems();
            }
        });
}

// Debounce untuk mengurangi frekuensi pencarian
let searchTimeout;
function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchItems, 300);
}

// Search Items
function searchItems() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();
    fetch('php/get_items.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const filteredData = data.filter(item => {
                const nameMatch = item.name ? item.name.toLowerCase().includes(searchValue) : false;
                const categoryMatch = item.category ? item.category.toLowerCase().includes(searchValue) : false;
                return nameMatch || categoryMatch;
            });

            const table = document.getElementById('inventoryTable');
            table.innerHTML = '';

            // Hitung total halaman untuk data yang difilter
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            currentPage = Math.min(currentPage, totalPages);
            if (currentPage < 1) currentPage = 1;

            // Ambil data untuk halaman saat ini
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedData = filteredData.slice(start, end);

            if (paginatedData.length === 0) {
                table.innerHTML = '<tr><td colspan="6" style="text-align: center;">No items found.</td></tr>';
            } else {
                paginatedData.forEach(item => {
                    const nameDisplay = searchValue && item.name.toLowerCase().includes(searchValue) 
                        ? item.name.replace(new RegExp(searchValue, 'gi'), match => `<span class="highlight">${match}</span>`) 
                        : item.name;
                    const categoryDisplay = searchValue && item.category.toLowerCase().includes(searchValue) 
                        ? item.category.replace(new RegExp(searchValue, 'gi'), match => `<span class="highlight">${match}</span>`) 
                        : item.category;

                    const row = `
                        <tr>
                            <td>${item.id}</td>
                            <td>${nameDisplay}</td>
                            <td>${item.quantity}</td>
                            <td>${formatRupiah(item.price)}</td>
                            <td>${categoryDisplay}</td>
                            <td>
                                <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                            </td>
                        </tr>`;
                    table.innerHTML += row;
                });
            }

            // Update pagination
            renderPageNumbers(totalPages);
            document.getElementById('prevButton').disabled = currentPage === 1;
            document.getElementById('nextButton').disabled = currentPage === totalPages;
        })
        .catch(error => {
            console.error('Error searching items:', error);
            showNotification('Failed to search items. Check console for details.');
        });
}

// Sort Table
let sortDirection = 1;
function sortTable(column) {
    fetch('php/get_items.php')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => {
                let valA = a[column];
                let valB = b[column];
                if (column === 'price' || column === 'quantity') {
                    valA = parseFloat(valA);
                    valB = parseFloat(valB);
                }
                return (valA > valB ? 1 : -1) * sortDirection;
            });
            sortDirection *= -1;

            const table = document.getElementById('inventoryTable');
            table.innerHTML = '';

            // Hitung total halaman
            const totalPages = Math.ceil(data.length / itemsPerPage);
            currentPage = Math.min(currentPage, totalPages);
            if (currentPage < 1) currentPage = 1;

            // Ambil data untuk halaman saat ini
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedData = data.slice(start, end);

            paginatedData.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${formatRupiah(item.price)}</td>
                        <td>${item.category}</td>
                        <td>
                            <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>`;
                table.innerHTML += row;
            });

            // Update pagination
            renderPageNumbers(totalPages);
            document.getElementById('prevButton').disabled = currentPage === 1;
            document.getElementById('nextButton').disabled = currentPage === totalPages;
        })
        .catch(error => console.error('Error sorting items:', error));
}

// Export to CSV
function exportToCSV() {
    fetch('php/get_items.php')
        .then(response => response.json())
        .then(data => {
            const headers = ['ID,Name,Quantity,Price,Category'];
            const rows = data.map(item => 
                `${item.id},${item.name},${item.quantity},${item.price},${item.category}`
            );
            const csvContent = headers.concat(rows).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', 'inventory.csv');
            a.click();
        })
        .catch(error => console.error('Error exporting to CSV:', error));
}

// Edit Item
function editItem(id) {
    fetch('php/get_items.php')
        .then(response => response.json())
        .then(data => {
            const item = data.find(item => item.id == id);
            if (item) {
                document.getElementById('editId').value = item.id;
                document.getElementById('editName').value = item.name;
                document.getElementById('editQuantity').value = item.quantity;
                document.getElementById('editPrice').value = item.price;
                document.getElementById('editCategory').value = item.category;

                const modal = document.getElementById('editModal');
                modal.style.display = 'block';
            }
        });
}

// Modal Close
const modal = document.getElementById('editModal');
const closeBtn = document.getElementsByClassName('close')[0];
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
};

// Delete Item
function deleteItem(id) {
    if (confirm('Are you sure?')) {
        fetch('php/delete_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadItems();
                showNotification('Item deleted successfully!');
            }
        })
        .catch(error => console.error('Error deleting item:', error));
    }
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}