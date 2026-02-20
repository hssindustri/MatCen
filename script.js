// ==========================================
// script.js - HANYA UNTUK UI & FITUR UMUM
// Semua fungsi Firebase (Login, Daftar) ada di index.html
// ==========================================

// Fungsi Fitur Pencarian Bahan Baku (Katalog)
window.searchMaterials = function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.cat-card');
    
    if (cards.length > 0) {
        cards.forEach(card => {
            // Memastikan dataset.cat ada sebelum dicari
            const kategori = card.dataset.cat ? card.dataset.cat.toLowerCase() : "";
            card.style.display = kategori.includes(query) ? 'block' : 'none';
        });
    } else {
        console.log("Katalog belum dimuat");
    }
};

// Fungsi Render Grafik Chart (Bisa dipanggil nanti saat dashboard terbuka)
window.renderDashboardChart = function() {
    const chartCanvas = document.getElementById('activityChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: { 
                labels: ['Jan','Feb','Mar','Apr'], 
                datasets: [{ 
                    label: 'Aktivitas Transaksi', 
                    data: [10, 20, 15, 30], 
                    borderColor: '#F15A24',
                    tension: 0.3 // Membuat garis melengkung halus
                }] 
            },
            options: { 
                responsive: true, 
                plugins: { legend: { display: false } } 
            }
        });
    }
};
