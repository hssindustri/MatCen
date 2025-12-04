const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// Init users dari localStorage
let users = JSON.parse(localStorage.getItem('matcenUsers')) || [];
let currentUser = null;

// Modal functions
function showModal(tab = 'login') {
    document.getElementById('modal').style.display = 'block';
    switchTab(tab);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// Register - Dengan validasi lebih baik
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;

    if (!name || !email || !pass || pass.length < 6) {
        alert('Mohon isi data dengan benar (password min 6 karakter)!');
        return;
    }
    if (users.find(u => u.email === email)) {
        alert('Email sudah terdaftar!');
        return;
    }

    const newUser = { 
        name, 
        email, 
        pass, 
        role, 
        orders: 0, 
        products: Math.floor(Math.random() * 50) + 10,
        joined: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('matcenUsers', JSON.stringify(users));
    alert('Daftar berhasil! Silakan login.');
    closeModal();
});

// Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;

    const user = users.find(u => u.email === email && u.pass === pass);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        loginSuccess();
    } else {
        alert('Email/password salah!');
    }
});

function loginSuccess() {
    closeModal();
    document.getElementById('navLogin').style.display = 'none';
    document.getElementById('navUser').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userInfo').innerHTML = `
        <h3>Selamat datang, ${currentUser.name} (${currentUser.role})</h3>
        <p>Email: ${currentUser.email} | Bergabung: ${new Date(currentUser.joined).toLocaleDateString('id-ID')}</p>
        <p><em>Mode: ${currentUser.role === 'supplier' ? 'Kelola katalog bahan baku' : 'Cari & pesan material'}</em></p>
    `;
    document.getElementById('orders').textContent = currentUser.orders;
    document.getElementById('products').textContent = currentUser.products;

    // Role-based dashboard enhancement
    if (currentUser.role === 'supplier') {
        document.getElementById('userInfo').innerHTML += '<p><button onclick="addProduct()">Tambah Produk</button></p>';
    }

    // Simple chart untuk activity (mirip Blibli analytics)
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [{ label: 'Aktivitas', data: [10, 20, 15, 25], borderColor: '#F15A24', tension: 0.1 }]
        },
        options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
    });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('navLogin').style.display = 'block';
    document.getElementById('navUser').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

// Tambah functions baru
function searchMaterials() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.cat-card');
    cards.forEach(card => {
        const cat = card.dataset.cat.toLowerCase();
        card.style.display = cat.includes(query) ? 'block' : 'none';
    });
}

function editProfile() {
    const newName = prompt('Nama baru:', currentUser.name);
    if (newName) {
        currentUser.name = newName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loginSuccess(); // Refresh
        alert('Profil diupdate!');
    }
}

function addProduct() {
    alert('Fitur tambah produk: Integrasikan dengan form upload (simulasi).');
}

// Smooth scroll & animations
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
});
document.querySelectorAll('.section').forEach(el => observer.observe(el));

// Search on enter
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMaterials();
});

// Init on load
window.addEventListener('load', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) loginSuccess();
    // Inisialisasi search listener
    document.getElementById('searchInput').addEventListener('input', searchMaterials);
});

